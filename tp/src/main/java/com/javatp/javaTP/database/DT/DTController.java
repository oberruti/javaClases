package com.javatp.javaTP.database.DT;



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
// public Optional<DT> dt(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/dt")
public class DTController {
    @Autowired
    private DTRepository dtRepository;
    
    @GetMapping
    public ArrayList<DT> getDTs() {
        return (ArrayList<DT>) dtRepository.findAll();
    }

    @PostMapping
    public DT saveDT(@RequestBody DT dt) {
        return dtRepository.save(dt);
    }

    @GetMapping(path = "/{id}")
    public Optional<DT> dt(@PathVariable("id") String id) {
        return (Optional<DT>) dtRepository.findById(id);
    }

    @DeleteMapping(path = "/{id}")
    public boolean deleteDT(@PathVariable("id") String id) {
        try {
            dtRepository.deleteById(id);
            return true;
        } catch(Exception err) {
            return false;
        }
    }

}
