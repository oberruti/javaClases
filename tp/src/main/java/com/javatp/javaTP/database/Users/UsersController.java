package com.javatp.javaTP.database.Users;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javatp.javaTP.database.Club.Club;
import com.javatp.javaTP.database.Club.ClubRepository;
import com.javatp.javaTP.database.Sessions.SessionsController;
import com.javatp.javaTP.exception.ApiRequestException;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private SessionsController sessionsController;

    public Optional<Users> getByUserId(String UserID) {
        return this.usersRepository.getUsersById(UserID);
    }

    @CrossOrigin("*")
    @GetMapping("/admin/query")
    public List<Users> usersAdmin(@RequestParam(name = "sessionToken", required = true ) String sessionToken ) {   
        if (this.sessionsController.isAdmin(sessionToken)) {
            try {
                List<Users> users = usersRepository.findAll();
                List<Club> clubs = clubRepository.findAll();
                List<String> usersIds = (clubs.stream().map(cl -> cl.getUserID().toString())).collect(Collectors.toList());

                return users.stream().filter(u -> usersIds.stream().noneMatch(uu -> uu.compareTo(u.getId().toString()) == 0)).collect(Collectors.toList());
            } catch (RuntimeException eClub) {
                throw new ApiRequestException("Error - No existen users");
            }
        } else {
            throw new ApiRequestException("Error - No puede acceder a esta informacion");
        }
            
    }
}