USE ces;
-- user status
CREATE TABLE IF NOT EXISTS user_statuses (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100)
) ENGINE=InnoDB;

-- user type
CREATE TABLE IF NOT EXISTS user_types (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100)
) ENGINE=InnoDB;

-- user info
CREATE TABLE IF NOT EXISTS users(
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(40),
    -- normalize from fks
    status_id TINYINT UNSIGNED NOT NULL,
    user_type_id TINYINT UNSIGNED NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    reset_token VARCHAR(255), -- no NOT NULL b/c unverified users won't have tokens yet
    verification_token VARCHAR(255), -- so it's possible for these columns to be empty
    account_suspended BOOLEAN NOT NULL DEFAULT FALSE, 
    promo_opt_in BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_status FOREIGN KEY (status_id) REFERENCES user_statuses(id),
    CONSTRAINT fk_user_type FOREIGN KEY (user_type_id) REFERENCES user_types(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    user_id BIGINT UNSIGNED NOT NULL,
    token CHAR(64) PRIMARY KEY,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- addresses
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(50) DEFAULT 'home',
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_one_address_per_user UNIQUE (user_id) 
) ENGINE=InnoDB;

-- payment cards (max 3)
CREATE TABLE IF NOT EXISTS payment_cards (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    brand ENUM('VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'OTHER') NOT NULL,
    last4 CHAR(4) NOT NULL,
    exp_month TINYINT UNSIGNED NOT NULL CHECK (exp_month BETWEEN 1 AND 12),
    exp_year SMALLINT UNSIGNED NOT NULL,
    billing_addr_id BIGINT UNSIGNED,
    token VARCHAR(255) NOT NULL, -- encrypted/tokenized card data
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_card_addr FOREIGN KEY (billing_addr_id) REFERENCES addresses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- num card limit 
DROP TRIGGER IF EXISTS trg_payment_cards_before_insert;
DELIMITER $$
CREATE TRIGGER trg_payment_cards_before_insert
BEFORE INSERT ON payment_cards
FOR EACH ROW
BEGIN
  DECLARE cnt INT;
  SELECT COUNT(*) INTO cnt FROM payment_cards WHERE user_id = NEW.user_id;
  IF cnt >= 3 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already has maximum of 3 payment cards';
  END IF;
END$$
DELIMITER ;

-- for password reset
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    user_id BIGINT UNSIGNED NOT NULL,
    token CHAR(64) PRIMARY KEY,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- maybe includde****** ? check
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status_id);
CREATE INDEX idx_users_type ON users(user_type_id);