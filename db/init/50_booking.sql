USE ces;

-- main booking records
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    screening_id BIGINT UNSIGNED NOT NULL,
    booking_number CHAR(12) NOT NULL UNIQUE, -- generated booking reference
    promotion_id BIGINT UNSIGNED NULL,
    subtotal_cost INT UNSIGNED NOT NULL, -- total of ticket prices in cents
    fees_cost INT UNSIGNED NOT NULL, -- online booking fees in cents
    tax_cost INT UNSIGNED NOT NULL, -- sales tax in cents
    discount_amount INT UNSIGNED NOT NULL DEFAULT 0, -- promo discount in cents
    total_cost INT UNSIGNED NOT NULL, -- final amount charged in cents
    status ENUM('PENDING', 'CONFIRMED', 'CANCELED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_ref VARCHAR(100) NULL, -- payment processor reference
    refund_deadline DATETIME NULL, -- 60 minutes before show time
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_b_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_b_screening FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE RESTRICT,
    CONSTRAINT fk_b_promo FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- individual tickets within a booking
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    ticket_number CHAR(14) NOT NULL UNIQUE, -- generated ticket reference
    age_classification ENUM('CHILD', 'ADULT', 'SENIOR') NOT NULL,
    price_cost INT UNSIGNED NOT NULL, -- individual ticket price in cents
    seat_id BIGINT UNSIGNED NOT NULL,
    screening_id BIGINT UNSIGNED NOT NULL, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_t_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_t_age FOREIGN KEY (age_classification) REFERENCES age_categories(classification) ON DELETE RESTRICT,
    CONSTRAINT fk_t_seat FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE RESTRICT,
    CONSTRAINT fk_t_screening FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE RESTRICT,
    -- ensure seat isn't double-booked for same screening
    UNIQUE KEY uq_seat_screening (seat_id, screening_id)
) ENGINE=InnoDB;

-- Performance indexes
CREATE INDEX idx_bookings_user ON bookings (user_id);
CREATE INDEX idx_bookings_screening ON bookings (screening_id);
CREATE INDEX idx_bookings_created ON bookings (created_at);
CREATE INDEX idx_tickets_screening ON tickets (screening_id);
CREATE INDEX idx_tickets_booking ON tickets (booking_id);