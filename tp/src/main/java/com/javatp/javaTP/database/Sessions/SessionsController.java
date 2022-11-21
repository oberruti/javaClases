package com.javatp.javaTP.database.Sessions;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.javatp.javaTP.database.Users.Users;
import com.javatp.javaTP.database.Users.UsersRepository;
import com.javatp.javaTP.exception.ApiRequestException;

@RestController
public class SessionsController {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    public Optional<Users> getByUserId(String UserID) {
        return this.usersRepository.getUsersById(UserID);
    }

    public String getAdminEmail() {
        return ("tpjavaberruti@gmail.com");
    }

    private Sessions getSessionByToken(String sessionToken ) {
        try {
            Sessions session = sessionsRepository.getSessionBySessionToken(sessionToken).get();
            return session;
        } catch(RuntimeException e) {
            throw new ApiRequestException("Error - Usted no esta autenticado");
        }
    }


    private String getEmailBySessionToken(String sessionToken) {
        Sessions session = getSessionByToken(sessionToken);
        try {
           return this.getByUserId(session.getUserId()).get().getEmail();
        } catch (RuntimeException eClub) {
            throw new ApiRequestException("Error - No existe mail asociado");
        }
    }

    public Boolean isAdmin(String sessionToken) {
        String email = this.getEmailBySessionToken(sessionToken);
        return email.compareTo(this.getAdminEmail()) == 0;
    }
}