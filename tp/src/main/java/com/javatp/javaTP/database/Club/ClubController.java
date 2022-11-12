package com.javatp.javaTP.database.Club;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsRepository;

//@GetMapping
// public Optional<Club> club(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/club")
public class ClubController {
    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    @PostMapping
    public Club saveClub(@RequestBody Club club) {
        return clubRepository.save(club);
    }

    @GetMapping("/query")
    public Club club(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return (Club) club;
        } catch(Exception e) {
            System.out.println(e);
            return new Club();
        }
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
