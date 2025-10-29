package com.cinema.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void generateHash() {
		var encoder = new BCryptPasswordEncoder();
    	System.out.println(encoder.encode("Team2admin!"));
	}


	@Test
	void contextLoads() {
	}

}
