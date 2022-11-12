package com.javatp.javaTP.database.Plantilla;



import java.util.ArrayList;
import java.util.Optional;

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
import com.javatp.javaTP.database.Jugador.Jugador;
import com.javatp.javaTP.database.Jugador.JugadorRepository;
import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsRepository;

//@GetMapping
// public Optional<Plantilla> plantilla(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/plantilla")
public class PlantillaController {
    @Autowired
    private PlantillaRepository plantillaRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private JugadorRepository jugadorRepository;
    
    @GetMapping("/query")
    public ArrayList<Plantilla> getPlantillaes(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return (ArrayList<Plantilla>) plantillaRepository.findByClubID(club.getId());
        } catch(Exception e) {
            System.out.println(e);
            return new ArrayList<Plantilla>();
        }
    }

    @CrossOrigin("*")
    @PostMapping("/query")
    public Plantilla savePlantilla(@RequestBody Plantilla plantilla, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            String idOne = club.getId();
            String idTwo = plantilla.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                return plantillaRepository.save(plantilla);
            }
        } catch(Exception e) {
            System.out.println(e);
            return new Plantilla();
        }
        return new Plantilla();
    }

    @GetMapping(path = "/{id}/query")
    public Optional<Plantilla> plantilla(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return (Optional<Plantilla>) plantillaRepository.findByIdAndClubID(id, club.getId());
        } catch(Exception e) {
            System.out.println(e);
        }
        return (Optional<Plantilla>) plantillaRepository.findByIdAndClubID("1", "1");
    }

    @GetMapping(path = "/{id}/jugadores/query")
    public ArrayList<Jugador> getJugadoresByPlantillaId(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
             Plantilla plantilla = plantillaRepository.findByIdAndClubID(id, club.getId()).get();
             String[] jugadoresIds = plantilla.getJugadoresIDs();
             ArrayList<Jugador> jugadores = new ArrayList<Jugador>();
             for (int i=0; i<jugadoresIds.length; i++) {
                Jugador jugador = jugadorRepository.getJugadorById(jugadoresIds[i]).get();
                jugadores.add(jugador);
             }
             return jugadores;
        } catch(Exception e) {
            System.out.println(e);
        }
        return (ArrayList<Jugador>) new ArrayList<Jugador>();
    }

    @CrossOrigin("*")
    @DeleteMapping(path = "/{id}/query")
    public boolean deletePlantilla(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();

            Club club = clubRepository.getClubByUserId(session.getUserId()).get();

            Plantilla plantilla = plantillaRepository.getPlantillaById(id).get();

            String idOne = club.getId();
            String idTwo = plantilla.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                plantillaRepository.deleteById(id);
                return true;
            }
            return false; 
        } catch(Exception err) {
            return false;
        }
    }

}
