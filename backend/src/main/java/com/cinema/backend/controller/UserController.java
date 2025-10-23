package com.cinema.backend.controller;

import com.cinema.backend.model.User;
import com.cinema.backend.dto.UserResponse;
import com.cinema.backend.dto.ChangePasswordRequest;
import com.cinema.backend.dto.UpdateUserRequest;
import com.cinema.backend.services.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Exposes user profile endpoints to the frontend.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    /** GET /api/users/{id}/profile — fetch profile for profile page */
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserResponse> getProfile(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(toResponse(userService.getById(id)));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** PATCH /api/users/{id} — partial update: firstName, lastName, phone, promoOptIn (email immutable) */
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest req
    ) {
        try {
            User updated = userService.updateBasics(id, req.firstName(), req.lastName(), req.phone(), req.promoOptIn());
            // "profile changed" email ??
            return ResponseEntity.ok(toResponse(updated));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** POST /api/users/{id}/change-password — verify currentPassword, then set newPassword */
    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest req
    ) {
        try {
            userService.changePassword(id, req.currentPassword(), req.newPassword());
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** POST /api/users/{id}/suspend?suspended=true — admin utility (wire @PreAuthorize later) */
    @PostMapping("/{id}/suspend")
    public ResponseEntity<?> setSuspended(@PathVariable Long id, @RequestParam boolean suspended) {
        try {
            userService.setSuspended(id, suspended);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Helper: convert User to UserResponse DTO */
    private static UserResponse toResponse(com.cinema.backend.model.User u) {
        return new UserResponse(
                u.getId(),
                u.getEmail(),
                u.getFirstName(),
                u.getLastName(),
                u.getPhone(),
                (u.getStatus() != null ? u.getStatus().getStatusName() : null),
                (u.getUserType() != null ? u.getUserType().getTypeName() : null),
                u.isVerified(),
                u.isAccountSuspended(),
                u.isPromoOptIn(),
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }


}
