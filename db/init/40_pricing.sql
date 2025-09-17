USE ces;

-- age classification for ticket pricing
CREATE TABLE IF NOT EXISTS age_categories (
    classification ENUM('CHILD', 'ADULT', 'SENIOR') PRIMARY KEY,
    min_age TINYINT UNSIGNED,
    max_age TINYINT UNSIGNED,
    description VARCHAR(100)
) ENGINE=InnoDB;

-- ticket prices by age category with effective dates
CREATE TABLE IF NOT EXISTS ticket_prices (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    age_classification ENUM('CHILD', 'ADULT', 'SENIOR') NOT NULL,
    price INT UNSIGNED NOT NULL, -- price in cents for decimal sake
    effective_on DATE NOT NULL,
    UNIQUE KEY uq_price_age_date (age_classification, effective_on),
    CONSTRAINT fk_tp_age FOREIGN KEY (age_classification) REFERENCES age_categories(classification) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- online booking fees and other fees
CREATE TABLE IF NOT EXISTS fees (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    amount INT UNSIGNED NOT NULL, -- amount in cents
    effective_on DATE NOT NULL,
    expires_on DATE NULL, 
    active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uq_fee_name_date (name, effective_on)
) ENGINE=InnoDB;

-- promotional codes for discounts
CREATE TABLE IF NOT EXISTS promotions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type ENUM('PERCENT', 'FIXED') NOT NULL,
    discount_value INT UNSIGNED NOT NULL,
    min_purchase_amount INT UNSIGNED DEFAULT 0, -- minimum purchase to apply promo
    max_uses INT UNSIGNED DEFAULT NULL, 
    current_uses INT UNSIGNED NOT NULL DEFAULT 0,
    starts_on DATE NOT NULL,
    ends_on DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_promo_code_active (code, active),
    INDEX idx_promo_dates (starts_on, ends_on)
) ENGINE=InnoDB;

-- users who opted in for promotional emails
CREATE TABLE IF NOT EXISTS promo_subscriptions (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    subscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;