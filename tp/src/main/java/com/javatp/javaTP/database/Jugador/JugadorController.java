package com.javatp.javaTP.database.Jugador;



import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
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
import com.javatp.javaTP.database.Plantilla.PlantillaRepository;
import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsRepository;

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
    
    @GetMapping("/query")
    public ArrayList<Jugador> getJugadores(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return (ArrayList<Jugador>) jugadorRepository.findByClubID(club.getId());
        } catch(Exception e) {
            System.out.println(e);
            return new ArrayList<Jugador>();
        }
    }

    @CrossOrigin("*")
    @PostMapping("/query")
    public Jugador saveJugador(@RequestBody Jugador jugador, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            String idOne = club.getId();
            String idTwo = jugador.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                return jugadorRepository.save(jugador);
            }
        } catch(Exception e) {
            System.out.println(e);
            return new Jugador();
        }
        return new Jugador();
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/{posicion}/query")
    public Stream<Jugador> jugadorIdealPosicion(@PathVariable("id") String id,@PathVariable("posicion") String posicion, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            Plantilla plantilla = plantillaRepository.getPlantillaById(id).get();
            List<Jugador> jugadoresList = this.getJugadores(sessionToken);
            String[] jugadoresEnPlantillaArray = plantilla.getJugadoresIDs();
            List<String> jugadoresEnPlantilla = Arrays.asList(jugadoresEnPlantillaArray);
            Stream<Jugador> jugadoresFiltrados = jugadoresList.stream().filter(jugador -> jugadoresEnPlantilla.contains(jugador.id) == false);
            Stream<Jugador> jugadoresFiltradosPorPosicion = jugadoresFiltrados.filter(jugador -> jugador.getPosicion().compareTo(posicion) == 0);

            return jugadoresFiltradosPorPosicion;
        } catch(Exception e) {
            System.out.println(e);
        }
        return null;
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/query")
    public Optional<Jugador> jugador(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return (Optional<Jugador>) jugadorRepository.findByIdAndClubID(id, club.getId());
        } catch(Exception e) {
            System.out.println(e);
        }
        return (Optional<Jugador>) jugadorRepository.findByIdAndClubID("1", "1");
    }

    @CrossOrigin("*")
    @DeleteMapping(path = "/{id}/query")
    public boolean deleteJugador(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();

            Club club = clubRepository.getClubByUserId(session.getUserId()).get();

            Jugador jugador = jugadorRepository.getJugadorById(id).get();

            String idOne = club.getId();
            String idTwo = jugador.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                jugadorRepository.deleteById(id);
                return true;
            }
            return false; 
        } catch(Exception err) {
            return false;
        }
    }

}
