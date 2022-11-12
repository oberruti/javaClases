package com.javatp.javaTP.database.Club;



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
// public Optional<Club> club(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/club")
public class ClubController {
    @Autowired
    private ClubRepository clubRepository;
    
    @GetMapping
    public ArrayList<Club> getClubes() {
        return (ArrayList<Club>) clubRepository.findAll();
    }

    @PostMapping
    public Club saveClub(@RequestBody Club club) {
        return clubRepository.save(club);
    }

    @GetMapping(path = "/{id}")
    public Optional<Club> club(@PathVariable("id") String id) {
        return (Optional<Club>) clubRepository.findById(id);
    }

    @DeleteMapping(path = "/{id}")
    public boolean deleteClub(@PathVariable("id") String id) {
        try {
            clubRepository.deleteById(id);
            return true;
        } catch(Exception err) {
            return false;
        }
    }

}
