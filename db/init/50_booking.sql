USE ces;

-- main booking records
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    screening_id BIGINT UNSIGNED NOT NULL,
    booking_number CHAR(12) NOT NULL UNIQUE, -- generated booking reference
    payment_card_id BIGINT UNSIGNED NULL, -- added payment card to booking
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
    CONSTRAINT fk_b_card FOREIGN KEY (payment_card_id) REFERENCES payment_cards(id) ON DELETE SET NULL,
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

-- seat avalability 
DROP TRIGGER IF EXISTS trg_tickets_after_insert;
DROP TRIGGER IF EXISTS trg_tickets_after_delete;
DROP TRIGGER IF EXISTS trg_tickets_after_update;
DELIMITER $$
CREATE TRIGGER trg_tickets_after_insert
AFTER INSERT ON tickets
FOR EACH ROW
BEGIN
  UPDATE screenings
     SET available_seats = GREATEST(0, available_seats - 1)
   WHERE id = NEW.screening_id;
END$$

CREATE TRIGGER trg_tickets_after_delete
AFTER DELETE ON tickets
FOR EACH ROW
BEGIN
  UPDATE screenings
     SET available_seats = available_seats + 1
   WHERE id = OLD.screening_id;
END$$

CREATE TRIGGER trg_tickets_after_update
AFTER UPDATE ON tickets
FOR EACH ROW
BEGIN
  IF OLD.screening_id <> NEW.screening_id THEN
    UPDATE screenings SET available_seats = available_seats + 1 WHERE id = OLD.screening_id;
    UPDATE screenings SET available_seats = GREATEST(0, available_seats - 1) WHERE id = NEW.screening_id;
  END IF;
END$$
DELIMITER ;

-- refund deadline
DROP TRIGGER IF EXISTS trg_bookings_before_insert;
DROP TRIGGER IF EXISTS trg_bookings_before_update;
DELIMITER $$
CREATE TRIGGER trg_bookings_before_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE show_time DATETIME;
    SELECT starts_at INTO show_time FROM screenings WHERE id = NEW.screening_id;
    SET NEW.refund_deadline = DATE_SUB(show_time, INTERVAL 60 MINUTE);
END$$

CREATE TRIGGER trg_bookings_before_update
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    DECLARE show_time DATETIME;
    IF NEW.screening_id <> OLD.screening_id THEN
        SELECT starts_at INTO show_time FROM screenings WHERE id = NEW.screening_id;
        SET NEW.refund_deadline = DATE_SUB(show_time, INTERVAL 60 MINUTE);
    END IF;
END$$
DELIMITER ;