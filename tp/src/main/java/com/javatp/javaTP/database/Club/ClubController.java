package com.javatp.javaTP.database.Club;

import java.util.NoSuchElementException;

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
import com.javatp.javaTP.exception.ApiRequestException;

//@GetMapping
// public Optional<Club> club(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/club")
public class ClubController {
    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private SessionsRepository sessionsRepository;


    private Sessions getSessionByToken(String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            return session;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - Usted no esta autenticado");
        }
    }

    private Club getClubBySessionToken(String sessionToken ) {
        Sessions session = getSessionByToken(sessionToken);
        try {
            Club club = clubRepository.getClubByUserId(session.getUserId()).get();
            return club;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No existe club asociado");
        }
    }

    @GetMapping("/query")
    public Club club(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
            Sessions session = getSessionByToken(sessionToken);
            try {
                Club club = clubRepository.getClubByUserId(session.getUserId()).get();
                return (Club) club;
            } catch (RuntimeException eClub) {
                throw new ApiRequestException("Error - No existe club asociado");
            }
    }

    @PostMapping
    public Club saveClub(@RequestBody Club club, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (club.getNacionalidad().isEmpty() || club.getNombre().isEmpty() || club.getSigla().isEmpty()) {
            throw new ApiRequestException("Error - No existe club asociado");
        }
        Sessions session = getSessionByToken(sessionToken);
        if (club.getId().isEmpty() == false) {
            try {
                return clubRepository.save(club);
            } catch (RuntimeException e) {
                throw new ApiRequestException("Error - No se pudo modificar el club");
            }
        } else {
            Club clubToSave = new Club(club.getNombre(), club.getSigla(), club.getNacionalidad(), session.getUserId());
            try {
                return clubRepository.save(clubToSave);
            } catch (RuntimeException e) {
                throw new ApiRequestException("Error - No se pudo guardar el club");
            }
        }
        
    }

    @DeleteMapping(path = "/{id}")
    public boolean deleteClub(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        getSessionByToken(sessionToken);

        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        try {
            clubRepository.deleteById(id);
            return true;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No se pudo eliminar el club");
        }
    }

}
