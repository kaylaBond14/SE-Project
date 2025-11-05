package com.cinema.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class GenerateHashTest {
  
  @Test
  void printHash() {
    System.out.println(new BCryptPasswordEncoder().encode("Team2admin!"));
  }
}