package com.javatp.javaTP.database.Jugador;



import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javatp.javaTP.database.Club.Club;
import com.javatp.javaTP.database.Club.ClubRepository;
import com.javatp.javaTP.database.Plantilla.Plantilla;
import com.javatp.javaTP.database.Plantilla.PlantillaController;
import com.javatp.javaTP.database.Plantilla.PlantillaRepository;
import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsRepository;
import com.javatp.javaTP.exception.ApiRequestException;

//@GetMapping
// public Optional<Jugador> jugador(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/jugador")
public class JugadorController {
    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private PlantillaRepository plantillaRepository;

    @Autowired
    private PlantillaController plantillaController;

    private Sessions getSessionByToken(String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            return session;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - Usted no esta autenticado");
        }
    }

    private Club getClubBySessionToken(String sessionToken ) {
        Sessions session = getSessionByToken(sessionToken);
        try {
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return club;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No existe club asociado");
        }
    }
    
    @GetMapping("/query")
    public ArrayList<Jugador> getJugadores(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        Club club = getClubBySessionToken(sessionToken);
        try {
            return (ArrayList<Jugador>) jugadorRepository.findByClubID(club.getId());
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - no existen jugadores");
        }
    }

    @CrossOrigin("*")
    @PostMapping("/query")
    public Jugador saveJugador(@RequestBody Jugador jugador, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (jugador.clubID.isEmpty() || jugador.edad == null || jugador.liga.isEmpty() || jugador.nacionalidad.isEmpty() || jugador.nombre.isEmpty() || jugador.piernaBuena == null || jugador.posicion == null) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
        try {
            String idOne = club.getId();
            String idTwo = jugador.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                return (Jugador)jugadorRepository.save(jugador);
            }
            throw new ApiRequestException("Error - no se puede guardar un jugador en otro club");
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - no se pudo guardar el jugador");
        }
    }

    private Plantilla getPlantillaById(String id) {
        try {
            Plantilla plantilla = plantillaRepository.getPlantillaById(id).get();
            return plantilla;
        } catch (RuntimeException e) {
            throw new ApiRequestException("Error - no existe plantilla");
        }
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/{posicion}/query")
    public Stream<Jugador> jugadorIdealPosicion(@PathVariable("id") String id,@PathVariable("posicion") String posicion, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty() || posicion.isEmpty()) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        getClubBySessionToken(sessionToken);
        Plantilla plantilla = getPlantillaById(id);
        List<Jugador> jugadoresList = this.getJugadores(sessionToken);
        String[] jugadoresEnPlantillaArray = plantilla.getJugadoresIDs();
        List<String> jugadoresEnPlantilla = Arrays.asList(jugadoresEnPlantillaArray);
        Stream<Jugador> jugadoresFiltrados = jugadoresList.stream().filter(jugador -> jugadoresEnPlantilla.contains(jugador.id) == false);
        Stream<Jugador> jugadoresFiltradosPorPosicion = jugadoresFiltrados.filter(jugador -> jugador.getPosicion().compareTo(posicion) == 0);

        return jugadoresFiltradosPorPosicion;
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/query")
    public Optional<Jugador> jugadorByClubId(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
        try {
            return (Optional<Jugador>) jugadorRepository.findByIdAndClubID(id, club.getId());
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No se pudo encontrar el jugador de ese club");
        }
    }

    @CrossOrigin("*")
    @DeleteMapping(path = "/{id}/query")
    public boolean deleteJugador(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
        try {
            Jugador jugador = jugadorRepository.getJugadorById(id).get();
            plantillaController.deleteJugadorFromPlantillas(id, sessionToken);

            String idOne = club.getId();
            String idTwo = jugador.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                jugadorRepository.deleteById(id);
                return true;
            }
            return false; 
        } catch(Exception err) {
            throw new ApiRequestException("Error - No se pudo eliminar el jugador");
        }
    }

}
