package com.cinema.backend.utils;

import java.util.Date;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenUtil {
    
    // SECRET_KEY is initialized at runtime from config/env; volatile for safe publication
    private static volatile SecretKey SECRET_KEY;
    private final static long EXPIRATION_TIME = 86400000; // Set expiration time to 24 hours

    // load base64 encoded secret from application.properties (jwt.secret) if provided
    @Value("${jwt.secret:}")
    private String jwtSecretProp;

    @PostConstruct
    private void initFromProperty() {
        if (jwtSecretProp != null && !jwtSecretProp.isBlank()) {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecretProp.trim());
            SECRET_KEY = Keys.hmacShaKeyFor(keyBytes);
            return;
        }
        // if property not set, don't initialize here — allow fallback logic to handle env/system property
    }

    // ensure key available for static callers (fallback to env / system property / ephemeral)
    private static void ensureKeyInitialized() {
        if (SECRET_KEY != null) return;

        String env = System.getenv("JWT_SECRET");
        if (env == null || env.isBlank()) {
            env = System.getProperty("jwt.secret");
        }
        if (env != null && !env.isBlank()) {
            byte[] keyBytes = Decoders.BASE64.decode(env.trim());
            SECRET_KEY = Keys.hmacShaKeyFor(keyBytes);
            return;
        }

        // final fallback (ephemeral) — warn because tokens will break after restart
        SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        System.err.println("WARNING: No JWT secret configured (property/env). Using ephemeral key; tokens will be invalid after restart.");
    }

    public static String generateToken(String email) {
        ensureKeyInitialized();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY) // algorithm inferred from key
                .compact();
    }

    public boolean validateToken(String token) {
        ensureKeyInitialized();
        return !isTokenExpired(token);
    }

    public String extractEmail(String token) {
        ensureKeyInitialized();
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build();

        return jwtParser.parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        ensureKeyInitialized();
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build();

        return jwtParser.parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}