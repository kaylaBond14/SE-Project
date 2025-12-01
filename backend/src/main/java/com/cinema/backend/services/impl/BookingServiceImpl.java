package com.cinema.backend.services.impl;

import com.cinema.backend.model.*;
import com.cinema.backend.repository.*;
import com.cinema.backend.services.BookingService;
import com.cinema.backend.dto.BookingHistoryResponse;
import com.cinema.backend.dto.CheckoutRequest;
import com.cinema.backend.dto.CheckoutResponse;
import com.cinema.backend.services.PromotionService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private static final double SALES_TAX_RATE = 0.07;

    private final BookingRepository bookingRepo;
    private final TicketRepository ticketRepo;
    private final SeatRepository seatRepo;
    private final ScreeningRepository screeningRepo;
    private final MovieRepository movieRepo;
    private final PaymentCardRepository cardRepo;
    private final FeeRepository feeRepo;
    private final PromotionRepository promoRepo;
    private final PromotionService promotionService;

    public BookingServiceImpl(BookingRepository bookingRepo,
                              TicketRepository ticketRepo,
                              SeatRepository seatRepo,
                              ScreeningRepository screeningRepo,
                              MovieRepository movieRepo,
                              PaymentCardRepository cardRepo,
                              FeeRepository feeRepo,
                              PromotionRepository promoRepo,
                              PromotionService promotionService) {
        this.bookingRepo = bookingRepo;
        this.ticketRepo = ticketRepo;
        this.seatRepo = seatRepo;
        this.screeningRepo = screeningRepo;
        this.movieRepo = movieRepo;
        this.cardRepo = cardRepo;
        this.feeRepo = feeRepo;
        this.promoRepo = promoRepo;
        this.promotionService = promotionService;
    }

    @Override
    @Transactional
    public Booking startBooking(Long userId,
                                Long screeningId,
                                List<TicketRequest> tickets) {
        if (userId == null || screeningId == null) {
            throw new IllegalArgumentException("userId and screeningId are required");
        }
        if (tickets == null || tickets.isEmpty()) {
            throw new IllegalArgumentException("At least one ticket is required");
        }

        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));

        if (screening.isCanceled()) {
            throw new IllegalStateException("Cannot book canceled screening");
        }

        if (screening.getAvailableSeats() != null && screening.getAvailableSeats() < tickets.size()) {
            throw new IllegalStateException("Not enough seats available for screening");
        }

        int subtotal = tickets.stream()
                .mapToInt(tr -> {
                    if (tr == null || tr.age == null || tr.priceCents < 0) {
                        throw new IllegalArgumentException("Invalid ticket request");
                    }
                    return tr.priceCents;
                })
                .sum();

        Booking b = new Booking();
        b.setUserId(userId);
        b.setScreeningId(screeningId);
        b.setBookingNumber(generateRef(12));
        b.setSubtotalCost(subtotal);
        b.setFeesCost(0);    
        b.setTaxCost(0);
        b.setDiscountAmount(0);
        b.setTotalCost(subtotal);
        b.setStatus(BookingStatus.PENDING);

        b = bookingRepo.save(b);

        return b;
    }

    @Override
    @Transactional
    public void assignSeats(Long bookingId, 
                        List<TicketWithSeatRequest> ticketsWithSeats) {
        if (bookingId == null) throw new IllegalArgumentException("bookingId is required");
        if (ticketsWithSeats == null || ticketsWithSeats.isEmpty()) {
            throw new IllegalArgumentException("Ticket and seat list cannot be empty");
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Can only assign seats to pending bookings");
        }

        int selectionsTotal = ticketsWithSeats.stream()
            .mapToInt(t -> t.priceCents)
            .sum();

        if (selectionsTotal != booking.getSubtotalCost()) {
        throw new IllegalArgumentException(
            "Seat selections don't match the original booking. " +
            "Expected total: " + booking.getSubtotalCost() + " cents, " +
            "but got: " + selectionsTotal + " cents. " +
            "Please select the correct number of seats with matching ticket types."
        );
    }

        

        List<Ticket> existingTickets = ticketRepo.findByBookingId(bookingId);
        if (!existingTickets.isEmpty()) {
            throw new IllegalStateException("Seats already assigned to this booking");
        }

        Long screeningId = booking.getScreeningId();
        
        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));
        Long hallId = screening.getHall().getId();


        List<Long> seatIds = ticketsWithSeats.stream()
                .map(t -> t.seatId)
                .toList();

        List<Seat> chosen = seatRepo.findAllById(seatIds);
        if (chosen.size() != seatIds.size()) {
            Set<Long> foundIds = chosen.stream().map(Seat::getId).collect(Collectors.toSet());
            List<Long> missing = seatIds.stream().filter(id -> !foundIds.contains(id)).toList();
            throw new IllegalArgumentException("Seats not found: " + missing);
        }
        
        boolean sameHall = chosen.stream().allMatch(seat -> Objects.equals(seat.getHall().getId(), hallId));
        if (!sameHall) {
            throw new IllegalArgumentException("All selected seats must be in hall " + hallId);
        }

        Set<Long> uniqueSeats = new HashSet<>(seatIds);
        if (uniqueSeats.size() != seatIds.size()) {
            throw new IllegalArgumentException("Cannot select the same seat multiple times");
        }

        for (Long seatId : seatIds) {
            if (ticketRepo.existsByScreeningIdAndSeatId(screeningId, seatId)) {
                throw new IllegalStateException("Seat already taken: " + seatId);
            }
        }

        for (TicketWithSeatRequest tws : ticketsWithSeats) {
            Ticket ticket = new Ticket();
            ticket.setBookingId(bookingId);
            ticket.setScreeningId(screeningId);
            ticket.setTicketNumber(generateRef(14));
            ticket.setAgeClassification(tws.age);
            ticket.setPriceCost(tws.priceCents);
            ticket.setSeatId(tws.seatId); 
            
            try {
                ticketRepo.saveAndFlush(ticket);
            } catch (DataIntegrityViolationException ex) {
                throw new IllegalStateException("One or more selected seats have just been taken. Please refresh.", ex);
            }
        }
    }

    @Override
    @Transactional
    public CheckoutResponse processCheckout(Long bookingId, CheckoutRequest request) {
        // Validate booking exists and is in correct state
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking already processed. Current status: " + booking.getStatus());
        }

        // Validate seats are assigned
        List<Ticket> tickets = ticketRepo.findByBookingId(bookingId);
        if (tickets.isEmpty()) {
            throw new IllegalStateException("No tickets found for booking. Please assign seats first.");
        }
        boolean allHaveSeats = tickets.stream().allMatch(t -> t.getSeatId() != null);
        if (!allHaveSeats) {
            throw new IllegalStateException("All tickets must have seats assigned before checkout");
        }

        // Validate screening is not canceled
        Screening screening = screeningRepo.findById(booking.getScreeningId())
                .orElseThrow(() -> new IllegalArgumentException("Screening not found"));
        if (screening.isCanceled()) {
            throw new IllegalStateException("Cannot checkout: screening has been canceled");
        }

        // Validate payment method
        validatePayment(request, booking.getUserId());

        // Query fees from database
        LocalDate today = LocalDate.now();
        int onlineFee = feeRepo.findActiveFeeByName("Online Booking Fee", today)
                .map(Fee::getAmount)
                .orElse(150); // Fallback to $1.50
        
        int processingFee = feeRepo.findActiveFeeByName("Processing Fee", today)
                .map(Fee::getAmount)
                .orElse(50); // Fallback to $0.50

        int totalFees = onlineFee + processingFee;

        // Calculate tax (hardcoded for now)
        int subtotal = booking.getSubtotalCost();
        int taxCost = (int) Math.round(subtotal * SALES_TAX_RATE);

        // Apply promotion if provided
        int discount = 0;
        String promoCode = null;
        if (request.promotionCode() != null && !request.promotionCode().isBlank()) {
            Promotion promo = promotionService.findValidByCodeOnDate(request.promotionCode(), today)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid or expired promotion code"));

            // Check usage limit
            if (promo.getMaxUses() != null && promo.getCurrentUses() >= promo.getMaxUses()) {
                throw new IllegalStateException("Promotion usage limit reached");
            }

            // Calculate discount
            discount = calculateDiscount(subtotal, promo);
            booking.setPromotionId(promo.getId());
            promoCode = promo.getCode();
            
            // Increment usage
            promoRepo.incrementCurrentUses(promo.getId());
        }

        // Calculate total
        int total = subtotal + totalFees + taxCost - discount;

        // Update booking with all costs
        booking.setFeesCost(totalFees);
        booking.setTaxCost(taxCost);
        booking.setDiscountAmount(discount);
        booking.setTotalCost(total);
        
        // Set payment card if using saved card
        if (request.savedCardId() != null) {
            booking.setPaymentCardId(request.savedCardId());
        }

        // Confirm booking
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(booking);

        // TODO: Send booking confirmation email
        // emailService.sendBookingConfirmationEmail(
        //     user.getEmail(), 
        //     booking.getBookingNumber(),
        //     movieTitle,
        //     screening.getStartsAt(),
        //     seatLabels,
        //     total
        // );

        // Build response
        return buildCheckoutResponse(booking, screening, tickets, promoCode);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingHistoryResponse> getOrderHistory(Long userId) {
        List<Booking> bookings = bookingRepo.findByUserIdOrderByCreatedAtDesc(userId);
        
        return bookings.stream()
                .map(this::buildBookingHistoryResponse)
                .toList();
    }

    private void validatePayment(CheckoutRequest request, Long userId) {
        // Must provide either saved card OR new card
        if (request.savedCardId() == null && request.newCard() == null) {
            throw new IllegalArgumentException("Payment method required: provide either savedCardId or newCard");
        }

        if (request.savedCardId() != null && request.newCard() != null) {
            throw new IllegalArgumentException("Provide only one payment method: savedCardId OR newCard, not both");
        }

        // Validate saved card
        if (request.savedCardId() != null) {
            PaymentCard card = cardRepo.findById(request.savedCardId())
                    .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));
            
            if (!card.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("Payment card does not belong to user");
            }

            // Check expiration
            if (isCardExpired(card.getExpYear(), card.getExpMonth())) {
                throw new IllegalArgumentException("Payment card has expired");
            }
        }

        // Validate new card 
        if (request.newCard() != null) {
            CheckoutRequest.NewCardInfo card = request.newCard();
            
            // Normalize and validate PAN 
            String pan = normalizePan(card.token());
            assertValidPan(pan);

            // Validate last4 matches
            String last4FromToken = pan.substring(pan.length() - 4);
            if (!last4FromToken.equals(card.last4())) {
                throw new IllegalArgumentException("Card last4 digits do not match token");
            }

            // Check expiration
            if (isCardExpired(card.expYear(), card.expMonth())) {
                throw new IllegalArgumentException("Payment card has expired");
            }
        }
    }

    private String normalizePan(String s) {
        if (s == null) return null;
        return s.replaceAll("[^0-9]", "");
    }

    private void assertValidPan(String pan) {
        if (pan == null) throw new IllegalArgumentException("Missing card number");
        if (!pan.matches("\\d{12,19}")) throw new IllegalArgumentException("Invalid card number length");
    }

    private boolean isCardExpired(int expYear, int expMonth) {
        LocalDate now = LocalDate.now();
        LocalDate expiration = LocalDate.of(expYear, expMonth, 1).plusMonths(1).minusDays(1);
        return expiration.isBefore(now);
    }

    private int calculateDiscount(int subtotalCents, Promotion promo) {
        if (promo.getDiscountType() == DiscountType.PERCENT) {
            long d = Math.round(subtotalCents * (promo.getDiscountValue() / 100.0));
            return (int) Math.min(Integer.MAX_VALUE, d);
        } else {
            // FIXED discount
            return promo.getDiscountValue();
        }
    }

    private CheckoutResponse buildCheckoutResponse(Booking booking, Screening screening, 
                                                   List<Ticket> tickets, String promoCode) {
        Movie movie = movieRepo.findById(screening.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        List<String> seatLabels = tickets.stream()
                .map(t -> seatRepo.findById(t.getSeatId())
                        .map(Seat::getLabel)
                        .orElse("Unknown"))
                .toList();

        CheckoutResponse.OrderSummary summary = new CheckoutResponse.OrderSummary(
                movie.getTitle(),
                screening.getStartsAt(),
                screening.getHall().getName(),
                seatLabels,
                booking.getSubtotalCost(),
                booking.getFeesCost(),
                booking.getTaxCost(),
                booking.getDiscountAmount(),
                booking.getTotalCost(),
                promoCode
        );

        return new CheckoutResponse(
                booking.getBookingNumber(),
                booking.getStatus().toString(),
                summary,
                "Booking confirmed successfully"
        );
    }

    private BookingHistoryResponse buildBookingHistoryResponse(Booking booking) {
        Screening screening = screeningRepo.findById(booking.getScreeningId())
                .orElseThrow(() -> new IllegalArgumentException("Screening not found"));

        Movie movie = movieRepo.findById(screening.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        List<Ticket> tickets = ticketRepo.findByBookingId(booking.getId());

        List<BookingHistoryResponse.TicketInfo> ticketInfos = tickets.stream()
                .map(t -> {
                    String seatLabel = seatRepo.findById(t.getSeatId())
                            .map(Seat::getLabel)
                            .orElse("Unknown");
                    return new BookingHistoryResponse.TicketInfo(
                            t.getTicketNumber(),
                            t.getAgeClassification().toString(),
                            t.getPriceCost(),
                            seatLabel
                    );
                })
                .toList();

        String promoCode = null;
        if (booking.getPromotionId() != null) {
            promoCode = promoRepo.findById(booking.getPromotionId())
                    .map(Promotion::getCode)
                    .orElse(null);
        }

        return new BookingHistoryResponse(
                booking.getId(),
                booking.getBookingNumber(),
                booking.getStatus().toString(),
                movie.getId(),
                movie.getTitle(),
                movie.getPosterUrl(),
                movie.getRuntimeMin(),
                screening.getStartsAt(),
                screening.getHall().getName(),
                screening.isCanceled(),
                ticketInfos,
                booking.getSubtotalCost(),
                booking.getFeesCost(),
                booking.getTaxCost(),
                booking.getDiscountAmount(),
                booking.getTotalCost(),
                promoCode,
                booking.getRefundDeadline(),
                booking.getCreatedAt()
        );
    }

    private String generateRef(int length) {
        String raw = java.util.UUID.randomUUID().toString().replace("-", "").toUpperCase();
        return raw.substring(0, Math.min(length, raw.length()));
    }
}
