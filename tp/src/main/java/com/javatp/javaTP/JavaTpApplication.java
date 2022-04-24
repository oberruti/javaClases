package com.javatp.javaTP;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Optional;

import com.javatp.javaTP.database.Club.Club;
import com.javatp.javaTP.database.Club.ClubRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class JavaTpApplication implements CommandLineRunner {

	@Autowired
	private ClubRepository club;
	public static void main(String[] args) {
		SpringApplication.run(JavaTpApplication.class, args);
	}

  @Override
  public void run(String... args) throws Exception {

    club.deleteAll();

    // save a couple of clubs
    club.save(new Club("Octaaaaaaa", "OCCCT", "Colombia", "1"));

    // fetch all club
    System.out.println("Club found with findAll():");
    System.out.println("-------------------------------");
    for (Club club : club.findAll()) {
      System.out.println(club);
    }
    System.out.println();

    // fetch an individual club
    // System.out.println("club found with findByName('Alice'):");
    // System.out.println("--------------------------------");
    // System.out.println(club.findByNombre("Octaaaaaaa"));

    // System.out.println("clubs found with findBySigla('Smith'):");
    // System.out.println("--------------------------------");
    // for (Club club : club.findBySigla("OCCCT")) {
    //   System.out.println(club);
    // }

    Optional<Club> opt = club.getClubById("504");
    if(opt.isPresent()) {
            System.out.println(opt.get());
    }
    else {
            System.out.println("DATA NOT FOUND");
    }

    Optional<Club> opt2 = club.getClubById("6264e3115ddd0e387318c3a0");
    if(opt2.isPresent()) {
            System.out.println(opt2.get());
    }
    else {
            System.out.println("DATA NOT FOUND");
    }

  }

}