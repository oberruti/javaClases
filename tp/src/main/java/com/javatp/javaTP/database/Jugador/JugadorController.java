package com.javatp.javaTP.database.Jugador;



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
