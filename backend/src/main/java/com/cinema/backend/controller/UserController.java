package com.cinema.backend.controller;

import com.cinema.backend.model.User;
import com.cinema.backend.model.Address;
import com.cinema.backend.model.PaymentCard;
import com.cinema.backend.dto.UserResponse;
import com.cinema.backend.dto.AddressRequest;
import com.cinema.backend.dto.AddressResponse;
import com.cinema.backend.dto.CardRequest;
import com.cinema.backend.dto.CardResponse;
import com.cinema.backend.dto.ChangePasswordRequest;
import com.cinema.backend.dto.RegisterRequest;
import com.cinema.backend.dto.ResetPasswordRequest;
import com.cinema.backend.dto.UpdateUserRequest;
import com.cinema.backend.services.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
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

    /** POST /api/users/reset-password — set password of account given the email and new desired password */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        try {
            userService.resetPassword(req.email(), req.newPassword());
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

    /** POST /api/register - create register and optional payment cards */
    @PostMapping("/api/register")
    @RequestMapping(value = "/api/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            User created = userService.register(req);
            return ResponseEntity.status(201).body(toResponse(created));
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (DataIntegrityViolationException dive) {
            return ResponseEntity.badRequest().body("Constraint violation during registration");
        }
    }

    //* GET /{id}/address  */
    @GetMapping("/{id}/address")
    public ResponseEntity<AddressResponse> getAddress(@PathVariable Long id) {
        try {
            Address a = userService.getAddress(id);
            return ResponseEntity.ok(toResponse(a));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //* POST address*/
    @PostMapping("/{id}/address")
    public ResponseEntity<?> createAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        try {
            Address a = userService.createAddress(id, req);
            return ResponseEntity.status(201).body(toResponse(a));
        } catch (IllegalStateException ise) {
            return ResponseEntity.status(409).body(ise.getMessage()); 
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //* PATCH  address*/
    @PatchMapping("/{id}/address/{addressId}")
    public ResponseEntity<?> patchAddress(@PathVariable Long id,
                                          @PathVariable Long addressId,
                                          @RequestBody AddressRequest req) {
        try {
            Address a = userService.patchAddress(id, addressId, req);
            return ResponseEntity.ok(toResponse(a));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        }
    }

    //* GET list cards*/
    @GetMapping("/{id}/cards")
    public ResponseEntity<List<CardResponse>> listCards(@PathVariable Long id) {
        try {
            List<PaymentCard> cards = userService.listCards(id);
            return ResponseEntity.ok(cards.stream().map(this::toResponse).toList());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/cards")
    public ResponseEntity<?> addCard(@PathVariable Long id, @Valid @RequestBody CardRequest req) {
        try {
            PaymentCard pc = userService.addCard(id, req);
            return ResponseEntity.status(201).body(toResponse(pc));
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/cards/{cardId}")
    public ResponseEntity<?> patchCard(@PathVariable Long id,
                                       @PathVariable Long cardId,
                                       @RequestBody CardRequest req) {
        try {
            PaymentCard pc = userService.patchCard(id, cardId, req);
            return ResponseEntity.ok(toResponse(pc));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        }
    }

    @DeleteMapping("/{id}/cards/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long id, @PathVariable Long cardId) {
        try {
            userService.deleteCard(id, cardId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        }
    }

    /** Helper: convert DTO */
    private static UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getPhone(),
                (u.getStatus() != null ? u.getStatus().getStatusName() : null),
                (u.getUserType() != null ? u.getUserType().getTypeName() : null),
                u.isVerified(), u.isAccountSuspended(), u.isPromoOptIn(),
                u.getCreatedAt(), u.getUpdatedAt()
        );
    }
    private AddressResponse toResponse(Address a) {
        return new AddressResponse(a.getId(), a.getLabel(), a.getStreet(), a.getCity(),
                a.getState(), a.getPostalCode(), a.getCountry());
    }
    private CardResponse toResponse(PaymentCard c) {
        return new CardResponse(
                c.getId(), c.getBrand(), c.getLast4(), c.getExpMonth(), c.getExpYear(),
                c.getBillingAddress() != null ? c.getBillingAddress().getId() : null
        );
    }
}




