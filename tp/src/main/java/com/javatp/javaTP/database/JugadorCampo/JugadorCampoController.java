package com.javatp.javaTP.database.JugadorCampo;



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
// public Optional<JugadorCampo> jugadorCampo(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/jugadorCampo")
public class JugadorCampoController {
    @Autowired
    private JugadorCampoRepository jugadorCampoRepository;
    
    @GetMapping
    public ArrayList<JugadorCampo> getJugadoresCampo() {
        return (ArrayList<JugadorCampo>) jugadorCampoRepository.findAll();
    }

    @PostMapping
    public JugadorCampo saveJugadorCampo(@RequestBody JugadorCampo jugadorCampo) {
        return jugadorCampoRepository.save(jugadorCampo);
    }

    @GetMapping(path = "/{id}")
    public Optional<JugadorCampo> jugadorCampo(@PathVariable("id") String id) {
        return (Optional<JugadorCampo>) jugadorCampoRepository.findById(id);
    }

    @DeleteMapping(path = "/{id}")
    public boolean deleteJugadorCampo(@PathVariable("id") String id) {
        try {
            jugadorCampoRepository.deleteById(id);
            return true;
        } catch(Exception err) {
            return false;
        }
    }

}
