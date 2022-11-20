package com.javatp.javaTP.database.Dt;



import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.javatp.javaTP.database.Plantilla.PlantillaController;
import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsRepository;
import com.javatp.javaTP.exception.ApiRequestException;

//@GetMapping
// public Optional<Dt> dt(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/dt")
public class DtController {
    @Autowired
    private DtRepository dtRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private PlantillaController plantillaController;

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
    
    @CrossOrigin("*")
    @GetMapping("/query")
    public ArrayList<Dt> getDtes(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        Club club = getClubBySessionToken(sessionToken);
        try {
            return (ArrayList<Dt>) dtRepository.findByClubID(club.getId());
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - no existen dtes");
        }
    }

    @CrossOrigin("*")
    @PostMapping("/query")
    public Dt saveDt(@RequestBody Dt dt, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (dt.getClubID().isEmpty() || dt.getLiga().isEmpty() || dt.getNacionalidad().isEmpty() || dt.getNombre().isEmpty()) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
        try {
            String idOne = club.getId();
            String idTwo = dt.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                return (Dt)dtRepository.save(dt);
            }
            throw new ApiRequestException("Error - no se puede guardar un dt en otro club");
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - no se pudo guardar el dt");
        }
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/query")
    public Optional<Dt> dtByClubId(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
        try {
            return (Optional<Dt>) dtRepository.findByIdAndClubID(id, club.getId());
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No se pudo encontrar el dt de ese club");
        }
    }

    @CrossOrigin("*")
    @DeleteMapping(path = "/{id}/query")
    public boolean deleteDt(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - campos incorrectos");
        }
        getClubBySessionToken(sessionToken);
        try {
            System.out.println("llega hasta aca");
            plantillaController.deleteDTFromPlantillas(id, sessionToken);
            System.out.println("llega hasta aca 1");
            dtRepository.deleteById(id);
            System.out.println("llega hasta aca 2");
            return true;
        } catch(Exception err) {
            throw new ApiRequestException("Error - No se pudo eliminar el dt");
        }
    }

}