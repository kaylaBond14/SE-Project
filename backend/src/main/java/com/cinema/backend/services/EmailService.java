package com.cinema.backend.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.cinema.backend.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void sendVerificationEmail(String email, String verificationToken) {
        String subject = "Email Verification";
        String path = "/req/signup/verify"; // CHANGE LATER
        String message = "Click the button below to verify your email address:";
        sendEmail(email, verificationToken, subject, path, message);
    }

    public void sendForgotPasswordEmail(String email, String resetToken, String newPassword) {
        String subject = "Password Reset Request";
        String path = "/req/reset-password"; // CHANGE LATER
        String message = "Click the button below to reset your password:";
        sendResetEmail(email, resetToken, newPassword, subject, path, message);
    }

    // General method used sending all types of emails
    // (Verification emails, Promo emails)
    private void sendEmail(String email, String token, String subject, String path, String message) {
        try {
            String actionUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .port(8080)
                    .path(path)
                    .queryParam("token", token)
                    .toUriString();

            String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        <a href="%s" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Proceed</a>
                        <p style="font-size: 14px; color: #777;">Or copy and paste this link into your browser:</p>
                        <p style="font-size: 14px; color: #007bff;">%s</p>
                        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
                    </div>
                """.formatted(subject, message, actionUrl, actionUrl);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    // Slightly modified version of sendEmail() for sendForgotPasswordEmail()
    // Need an additional queryParam for the new password
    private void sendResetEmail(String email, String token, String newPassword, String subject, String path, String message) {
        try {
            String actionUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .port(8080)
                    .path(path)
                    .queryParam("token", token)
                    .queryParam("newPassword", newPassword)
                    .toUriString();

            String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        <a href="%s" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Proceed</a>
                        <p style="font-size: 14px; color: #777;">Or copy and paste this link into your browser:</p>
                        <p style="font-size: 14px; color: #007bff;">%s</p>
                        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
                    </div>
                """.formatted(subject, message, actionUrl, actionUrl);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }


    // Sends a "Profile Edited Notification" email with no attached link or tokens
    private void sendProfileEditedEmail(String email, String subject, String message) {
        try {
            String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
                    </div>
                """.formatted(subject, message);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(content, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendUpdatedBasicsEmail(String email) {
        String subject = "Your Profile has been Changed";
        String message = "Your account details (name, phone number, and/or Promotion Opt-in Status) have been edited. If you did not make these changes, please log in immediately and change your password.";
        sendProfileEditedEmail(email, subject, message);
    }

    public void sendPasswordChangedEmail(String email) {
        String subject = "Your Password has been Changed";
        String message = "Your account's password has been edited. If you did not make this change, please log in immediately and change your password.";
        sendProfileEditedEmail(email, subject, message);
    }

    public void sendUpdatedAddressEmail(String email) {
        String subject = "Your Home Address has been Changed";
        String message = "Your account's Home Address has been edited. If you did not make this change, please log in immediately and change your password.";
        sendProfileEditedEmail(email, subject, message);
    }

    public void sendAddedCardEmail(String email) {
        String subject = "Your Payment Card Info has been Changed";
        String message = "A new Payment Card has been added to your account. If you did not make this change, please log in immediately and change your password.";
        sendProfileEditedEmail(email, subject, message);
    }

    public void sendUpdatedCardEmail(String email) {
        String subject = "Your Payment Card Info has been Changed";
        String message = "One of your account's Payment Cards has been edited. If you did not make this change, please log in immediately and change your password.";
        sendProfileEditedEmail(email, subject, message);
    }

    public void sendDeletedCardEmail(String email) {
        String subject = "Your Payment Card Info has been Changed";
        String message = "One of your account's Payment Cards has been deleted. If you did not make this change, please log in immediately and change your password.";
        sendProfileEditedEmail(email, subject, message);
    }

    
    // Sends a promo email with no attached link or tokens
    // Similar to sendProfileEditedEmail(), but just with different formatting
    private void sendPromotionEmail(String email, String subject, String message1, String promoCode, String message2, String duration) {
        try {
            String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        <p style="font-size: 16px; color: #218614ff;">%s</p>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        <p style="font-size: 14px; color: #555;">%s</p>
                        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
                    </div>
                """.formatted(subject, message1, promoCode, message2, duration);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(content, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
    
    public void sendPromotionEmail(String email, String promoCode, Integer discount, LocalDate startsOn, LocalDate endsOn) {
        String subject = "New Promotion Just for You! Save " + discount + "% off your next purchase!";
        //String message = "We're excited to offer you an exclusive promotion:\n" + promoCode + "\nUse this code during your next purchase to enjoy a " + discount + "% discount!";
        String message1 = "We're excited to offer you an exclusive promotion:";
        String message2 = "Use this code during your next purchase to enjoy a " + discount + "% discount!";
        String duration = " This promotion is valid from " + startsOn.toString() + " to " + endsOn.toString() + ".";
        sendPromotionEmail(email, subject, message1, promoCode, message2, duration);
    }
}
