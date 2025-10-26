package com.cinema.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Temporary disables authentication and allows all requests.
 * TODO: Secure endpoints using JWT tokens and roles.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for testing / frontend integration
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // allow every request (no auth required yet)
            );
        return http.build();
    }

    /**
     * PasswordEncoder for password hashing later
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}