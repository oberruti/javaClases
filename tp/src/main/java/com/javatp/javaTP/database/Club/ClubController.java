package com.javatp.javaTP.database.Club;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsController;
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

    @Autowired
    private SessionsController sessionsController;

    private Sessions getSessionByToken(String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            return session;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - Usted no esta autenticado");
        }
    }

    @CrossOrigin("*")
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

    @CrossOrigin("*")
    @GetMapping("/admin/query/{id}")
    public Club clubAdmin(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken) {   
        if (this.sessionsController.isAdmin(sessionToken)) {
            if (id.isEmpty()) {
                throw new ApiRequestException("Error - Parametros incorrectos");
            }
            try {
                Club club = clubRepository.findById(id).get();
                return club;
            } catch (RuntimeException eClub) {
                throw new ApiRequestException("Error - No existe club asociado");
            }
        } else {
            throw new ApiRequestException("Error - No puede acceder a esta informacion");
        }
            
    }

    @CrossOrigin("*")
    @GetMapping("/admin/query")
    public List<Club> clubesAdmin(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {   
        if (this.sessionsController.isAdmin(sessionToken)) {
            try {
                List<Club> club = clubRepository.findAll();
                return club;
            } catch (RuntimeException eClub) {
                throw new ApiRequestException("Error - No existen clubes asociados");
            }
        } else {
            throw new ApiRequestException("Error - No puede acceder a esta informacion");
        }
            
    }

    @CrossOrigin("*")
    @PostMapping("/query")
    public Club saveClub(@RequestBody Club club, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (club.getNacionalidad().isEmpty() || club.getNombre().isEmpty() || club.getSigla().isEmpty() || club.getUserID().isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        if (club.getId() != null) {
            try {
                return clubRepository.save(club);
            } catch (RuntimeException e) {
                throw new ApiRequestException("Error - No se pudo modificar el club");
            }
        } else {
            Club clubToSave = new Club(club.getNombre(), club.getSigla(), club.getNacionalidad(), club.getUserID());
            try {
                return clubRepository.save(clubToSave);
            } catch (RuntimeException e) {
                throw new ApiRequestException("Error - No se pudo guardar el club");
            }
        }
        
    }
}
