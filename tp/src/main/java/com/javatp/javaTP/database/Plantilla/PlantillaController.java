package com.javatp.javaTP.database.Plantilla;



import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.*;

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
import com.javatp.javaTP.database.Dtt.Dtt;
import com.javatp.javaTP.database.Dtt.DttRepository;
import com.javatp.javaTP.database.Jugador.Jugador;
import com.javatp.javaTP.database.Jugador.JugadorRepository;
import com.javatp.javaTP.database.Sessions.Sessions;
import com.javatp.javaTP.database.Sessions.SessionsController;
import com.javatp.javaTP.database.Sessions.SessionsRepository;
import com.javatp.javaTP.exception.ApiRequestException;

//@GetMapping
// public Optional<Plantilla> plantilla(@RequestParam(name = "id", required = false, defaultValue = "hola" ) String id ) {

@RestController
@RequestMapping("/plantilla")
public class PlantillaController {

    @Autowired
    private PlantillaRepository plantillaRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private DttRepository dtRepository;

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
    public ArrayList<Plantilla> getPlantillaes(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        Club club = getClubBySessionToken(sessionToken);
        try {
            return (ArrayList<Plantilla>) plantillaRepository.findByClubID(club.getId());
        }  catch(RuntimeException e) {
            throw new ApiRequestException("Error - No existen plantillas para ese club");
        }
    }

    @CrossOrigin("*")
    @GetMapping("/admin/query")
    public ArrayList<Plantilla> getPlantillasAdmin(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (sessionsController.isAdmin(sessionToken)) {
            try {
                return (ArrayList<Plantilla>) plantillaRepository.findAll();
            }  catch(RuntimeException e) {
                throw new ApiRequestException("Error - No existen plantillas para ese club");
            }
        } else {
            throw new ApiRequestException("Error - Usted no esta autenticado");
        }
    }

    @CrossOrigin("*")
    @PostMapping("/query")
    public Plantilla savePlantilla(@RequestBody Plantilla plantilla, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        System.out.println(plantilla.toString());
        if (plantilla.getEsTitular() == null || plantilla.getClubID().isEmpty() || plantilla.getNombre().isEmpty() || plantilla.getTactica() == null || plantilla.getDtId() == null)
        {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }

        Club club = getClubBySessionToken(sessionToken);
        
        try {
            String idOne = club.getId();
            String idTwo = plantilla.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                return (Plantilla) plantillaRepository.save(plantilla);
            }
            throw new ApiRequestException("Error - No se pudo guardar la plantilla");
        } catch(RuntimeException e) {
           throw new ApiRequestException("Error - No se pudo guardar la plantilla");
        }
    }

    @CrossOrigin("*")
    @PostMapping("/admin/query")
    public Plantilla savePlantillaAdmin(@RequestBody Plantilla plantilla, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (sessionsController.isAdmin(sessionToken)) {
            if (plantilla.getEsTitular() == null || plantilla.getClubID().isEmpty() || plantilla.getNombre().isEmpty() || plantilla.getTactica() == null || plantilla.getDtId() == null)
            {
                throw new ApiRequestException("Error - Parametros incorrectos");
            }
            try {
                return (Plantilla) plantillaRepository.save(plantilla);
            } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No se pudo guardar la plantilla");
            }
        } else {
            throw new ApiRequestException("Error - Usted no esta autorizado");
        }
    }

    @GetMapping(path = "/{id}/query")
    public Optional<Plantilla> plantilla(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
        try {
            return (Optional<Plantilla>) plantillaRepository.findByIdAndClubID(id, club.getId());
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - No se encontro la plantilla");
        }
    }

    private Plantilla getPlantillaByIdAndClubId(String id, String clubId) {
        try {
            Plantilla plantilla = plantillaRepository.findByIdAndClubID(id, clubId).get();
            return plantilla;
        } catch (RuntimeException e) {
            throw new ApiRequestException("Error - No se encontro la plantilla");
        }
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/jugadores/query")
    public ArrayList<Jugador> getJugadoresByPlantillaId(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
             Plantilla plantilla = getPlantillaByIdAndClubId(id, club.getId());
             String[] jugadoresIds = plantilla.getJugadoresIDs();
             ArrayList<Jugador> jugadores = new ArrayList<Jugador>();
             try {
                for (int i=0; i<jugadoresIds.length; i++) {
                    Jugador jugador = jugadorRepository.getJugadorById(jugadoresIds[i]).get();
                    jugadores.add(jugador);
                }
                return jugadores;
            } catch(RuntimeException e) {
                throw new ApiRequestException("Error - No se encontraron jugadores");
            }
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/admin/jugadores/query")
    public ArrayList<Jugador> getJugadoresByPlantillaIdAdmin(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        if (sessionsController.isAdmin(sessionToken)) {
                Plantilla plantilla = getPlantillaById(id);
                String[] jugadoresIds = plantilla.getJugadoresIDs();
                ArrayList<Jugador> jugadores = new ArrayList<Jugador>();
                try {
                   for (int i=0; i<jugadoresIds.length; i++) {
                       Jugador jugador = jugadorRepository.getJugadorById(jugadoresIds[i]).get();
                       jugadores.add(jugador);
                   }
                   return jugadores;
               } catch(RuntimeException e) {
                   throw new ApiRequestException("Error - No se encontraron jugadores");
               }
        } else {
            throw new ApiRequestException("Error - Usted no esta autenticado");
        }
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/dt/query")
    public Dtt getDTByPlantillaId(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);
             Plantilla plantilla = getPlantillaByIdAndClubId(id, club.getId());
             String dtID = plantilla.getDtId();
             if (dtID != null && dtID.compareTo("") != 0 ) {
                try {
                    Dtt dt = dtRepository.getDTById(dtID).get();
                    return dt;
                } catch(RuntimeException e) {
                    throw new ApiRequestException("Error - No se encontro dt");
                }
             }
             throw new ApiRequestException("Error - No se encontro dt para esta plantilla");
    }

    @CrossOrigin("*")
    @GetMapping(path = "/{id}/admin/dt/query")
    public Dtt getDTByPlantillaIdAdmin(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }

        if (sessionsController.isAdmin(sessionToken)) {
            Plantilla plantilla = getPlantillaById(id);
            String dtID = plantilla.getDtId();
            if (dtID != null && dtID.compareTo("") != 0 ) {
               try {
                   Dtt dt = dtRepository.getDTById(dtID).get();
                   return dt;
               } catch(RuntimeException e) {
                   throw new ApiRequestException("Error - No se encontro dt");
               }
            }
            throw new ApiRequestException("Error - No se encontro dt para esta plantilla");
    } else {
        throw new ApiRequestException("Error - Usted no esta autenticado");
    }
}

    private Plantilla getPlantillaById(String id) {
        try {
            Plantilla plantilla = plantillaRepository.getPlantillaById(id).get();
            return plantilla;
        } catch (RuntimeException e) {
            throw new ApiRequestException("Error - No se encontro la plantilla");
        }
    }

    @CrossOrigin("*")
    @DeleteMapping(path = "/admin/{id}/query")
    public boolean deletePlantillaAdmin(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (sessionsController.isAdmin(sessionToken)) {        
            if (id.isEmpty()) {
                throw new ApiRequestException("Error - Parametros incorrectos");
            }
            try {
                plantillaRepository.deleteById(id);
                return true;
            } catch(RuntimeException err) {
                throw new ApiRequestException("Error - No se pudo eliminar la plantilla");
            }
        } else {
            throw new ApiRequestException("Error - Usted no esta autorizado");
        }
    }

    @CrossOrigin("*")
    @DeleteMapping(path = "/{id}/query")
    public boolean deletePlantilla(@PathVariable("id") String id, @RequestParam(name = "sessionToken", required = true ) String sessionToken ) {
        if (id.isEmpty()) {
            throw new ApiRequestException("Error - Parametros incorrectos");
        }
        Club club = getClubBySessionToken(sessionToken);

        Plantilla plantilla = getPlantillaById(id);
        try {
            String idOne = club.getId();
            String idTwo = plantilla.getClubID();
            if (idOne.compareTo(idTwo) == 0) {
                plantillaRepository.deleteById(id);
                return true;
            }
            throw new ApiRequestException("Error - No se pudo eliminar la plantilla");
        } catch(RuntimeException err) {
            throw new ApiRequestException("Error - No se pudo eliminar la plantilla");
        }
    }

    
    public void deleteJugadorFromPlantillas(String id, String sessionToken) {
        List<Plantilla> plantillas = this.getPlantillaes(sessionToken);
        for (Plantilla plantilla : plantillas) {
            List<String> jugadores = Arrays.asList(plantilla.getJugadoresIDs());
            for (String jugador : jugadores) {
                if (jugador.compareTo(id) == 0) {
                    ArrayList<String> jugadoresAGuardar = new ArrayList<String>();
                    Stream<String> jugadoresAFiltrar = jugadores.stream().filter(jug -> (jug.compareTo(id) != 0));
                    jugadoresAFiltrar.forEach(idd -> jugadoresAGuardar.add(idd));
                    String arr[] = new String[jugadores.size()-1];
                    arr = jugadoresAGuardar.toArray(arr);
                    plantilla.setJugadoresIDs(arr);
                    this.savePlantilla(plantilla, sessionToken);
                }
            }
        }
    }

    public void deleteJugadorFromPlantillasAdmin(String id, String sessionToken) {
        List<Plantilla> plantillas = this.getPlantillasAdmin(sessionToken);
        for (Plantilla plantilla : plantillas) {
            List<String> jugadores = Arrays.asList(plantilla.getJugadoresIDs());
            for (String jugador : jugadores) {
                if (jugador.compareTo(id) == 0) {
                    ArrayList<String> jugadoresAGuardar = new ArrayList<String>();
                    Stream<String> jugadoresAFiltrar = jugadores.stream().filter(jug -> (jug.compareTo(id) != 0));
                    jugadoresAFiltrar.forEach(idd -> jugadoresAGuardar.add(idd));
                    String arr[] = new String[jugadores.size()-1];
                    arr = jugadoresAGuardar.toArray(arr);
                    plantilla.setJugadoresIDs(arr);
                    this.savePlantilla(plantilla, sessionToken);
                }
            }
        }
    }

    public void deleteDTFromPlantillas(String id, String sessionToken) {
        List<Plantilla> plantillas = this.getPlantillaes(sessionToken);
        for (Plantilla plantilla : plantillas) {
            System.out.println("llega hasta aca plantillas");
            String dt = plantilla.getDtId();
            System.out.println("llega hasta aca plantillas 2" + dt.toString());
                if (dt.compareTo(id) == 0) {
                    throw new ApiRequestException("Error - No se pudo eliminar un DT que tiene plantilla asociada");
                }
        }
    }

    public void deleteDTFromPlantillasAdmin(String id, String sessionToken) {
        List<Plantilla> plantillas = this.getPlantillasAdmin(sessionToken);
        for (Plantilla plantilla : plantillas) {
            System.out.println("llega hasta aca plantillas");
            String dt = plantilla.getDtId();
            System.out.println("llega hasta aca plantillas 2" + dt.toString());
                if (dt.compareTo(id) == 0) {
                    throw new ApiRequestException("Error - No se pudo eliminar un DT que tiene plantilla asociada");
                }
        }
    }

}
