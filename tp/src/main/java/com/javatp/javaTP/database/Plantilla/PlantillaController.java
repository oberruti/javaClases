package com.javatp.javaTP.database.Plantilla;



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
// public Optional<Plantilla> plantilla(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/plantilla")
public class PlantillaController {
    @Autowired
    private PlantillaRepository plantillaRepository;
    
    @GetMapping
    public ArrayList<Plantilla> getPlantillas() {
        return (ArrayList<Plantilla>) plantillaRepository.findAll();
    }

    @PostMapping
    public Plantilla savePlantilla(@RequestBody Plantilla plantilla) {
        return plantillaRepository.save(plantilla);
    }

    @GetMapping(path = "/{id}")
    public Optional<Plantilla> plantilla(@PathVariable("id") String id) {
        return (Optional<Plantilla>) plantillaRepository.findById(id);
    }

    @DeleteMapping(path = "/{id}")
    public boolean deletePlantilla(@PathVariable("id") String id) {
        try {
            plantillaRepository.deleteById(id);
            return true;
        } catch(Exception err) {
            return false;
        }
    }

}
