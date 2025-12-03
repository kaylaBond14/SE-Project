package com.cinema.backend.crypto;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/*
 * This class is part of our implemnetation of the Proxy Design Pattern.

 * Both CryptoStringConverter and CryptoProxy implement the same interface AttributeConverter
 * to encrypt data before storing it in the database and decrypt it when reading from the database.
 * 
 * CryptoProxy acts as a Protective / Security Proxy, validating the card number from the User before
 * delegating the actual encryption/decryption work to CryptoStringConverter.
 */
@Converter
public class CryptoProxy implements AttributeConverter<String, String> {
    
    @Autowired
    private CryptoStringConverter cryptoStringConverter; // The real subject, composition


    //Card Helpers
    private static String normalizePan(String s) {
        if (s == null) return null;
        return s.replaceAll("[^0-9]", ""); 
    }

    private static void assertValidPan(String pan) {
        if (pan == null) throw new IllegalArgumentException("Missing card number");
        if (!pan.matches("\\d{12,19}")) throw new IllegalArgumentException("Invalid card number length");
        //if (!luhnOk(pan)) throw new IllegalArgumentException("Invalid card number (Luhn)");
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        String pan = normalizePan(attribute);
        assertValidPan(pan);
        return cryptoStringConverter.convertToDatabaseColumn(pan); // Delegate to real subject
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return cryptoStringConverter.convertToEntityAttribute(dbData); // Delegate to real subject
    }
}