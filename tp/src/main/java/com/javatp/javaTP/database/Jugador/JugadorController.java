package com.javatp.javaTP.database.Jugador;



import java.util.ArrayList;
import java.util.Optional;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//@GetMapping
// public Optional<Jugador> jugador(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/jugador")
public class JugadorController {
    @Autowired
    private JugadorRepository jugadorRepository;
    
    @GetMapping
    public ArrayList<Jugador> getJugadores() {
        return (ArrayList<Jugador>) jugadorRepository.findAll();
    }

    @PostMapping
    public Jugador saveJugador(@RequestBody Jugador jugador) {
        return jugadorRepository.save(jugador);
    }

    @GetMapping(path = "/{id}")
    public Optional<Jugador> jugador(@PathVariable("id") String id) {
        return (Optional<Jugador>) jugadorRepository.findById(id);
    }

    @DeleteMapping(path = "/{id}")
    public boolean deleteJugador(@PathVariable("id") String id) {
        try {
            jugadorRepository.deleteById(id);
            return true;
        } catch(Exception err) {
            return false;
        }
    }

}
