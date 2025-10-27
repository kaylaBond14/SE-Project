package com.cinema.backend.crypto;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Converter
public class CryptoStringConverter implements AttributeConverter<String, String> {
    private static final String TRANSFORM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_BITS = 128;
    private static final int IV_LEN = 12;

    private static final SecretKeySpec KEY;
    private static final SecureRandom RNG = new SecureRandom();

    static {
        String key = System.getenv("CARD_ENC_KEY");
        if (key == null) {
            throw new IllegalStateException("CARD_ENC_KEY env var is not set");
        }
        byte[] kb = key.getBytes(StandardCharsets.UTF_8);
        if (!(kb.length == 16 || kb.length == 32)) {
            throw new IllegalStateException("CARD_ENC_KEY must be 16 or 32 bytes, got " + kb.length);
        }
        KEY = new SecretKeySpec(kb, "AES");
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        try {
            byte[] iv = new byte[IV_LEN];
            RNG.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORM);
            cipher.init(Cipher.ENCRYPT_MODE, KEY, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] ciphertext = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));

            byte[] out = new byte[iv.length + ciphertext.length];
            System.arraycopy(iv, 0, out, 0, iv.length);
            System.arraycopy(ciphertext, 0, out, iv.length, ciphertext.length);

            return Base64.getEncoder().encodeToString(out);
        } catch (Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            byte[] input = Base64.getDecoder().decode(dbData);
            byte[] iv = java.util.Arrays.copyOfRange(input, 0, IV_LEN);
            byte[] ciphertext = java.util.Arrays.copyOfRange(input, IV_LEN, input.length);

            Cipher cipher = Cipher.getInstance(TRANSFORM);
            cipher.init(Cipher.DECRYPT_MODE, KEY, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] plaintext = cipher.doFinal(ciphertext);

            return new String(plaintext, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }
}
