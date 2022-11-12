package com.javatp.javaTP.database.Arquero;



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
// public Optional<Arquero> arquero(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/arquero")
public class ArqueroController {
    @Autowired
    private ArqueroRepository arqueroRepository;
    
    @GetMapping
    public ArrayList<Arquero> getArqueros() {
        return (ArrayList<Arquero>) arqueroRepository.findAll();
    }

    @PostMapping
    public Arquero saveArquero(@RequestBody Arquero arquero) {
       return arqueroRepository.save(arquero);
    }

    @GetMapping(path = "/{id}")
    public Optional<Arquero> arquero(@PathVariable("id") String id) {
        return (Optional<Arquero>) arqueroRepository.findById(id);
    }

    @DeleteMapping(path = "/{id}")
    public boolean deleteArquero(@PathVariable("id") String id) {
        try {
            arqueroRepository.deleteById(id);
            return true;
        } catch(Exception err) {
            return false;
        }
    }

}
