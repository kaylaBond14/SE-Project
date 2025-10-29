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
    email VARCHAR(255) NOT NULL UNIQUE, -- prevent duplicate accounts
    password_hash VARCHAR(255) NOT NULL, -- hash to securly store paswords, not plain text
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(40), -- no not null since optional at registration
    -- normalize from fks
    status_id TINYINT UNSIGNED NOT NULL, -- fk
    user_type_id TINYINT UNSIGNED NOT NULL, -- fk
    is_verified BOOLEAN NOT NULL DEFAULT FALSE, -- set to false so user has to verify from email
    reset_token VARCHAR(255) NOT NULL, -- reset password
    verification_token VARCHAR(255) NOT NULL,
    account_suspended BOOLEAN NOT NULL DEFAULT FALSE, 
    promo_opt_in BOOLEAN NOT NULL DEFAULT FALSE, -- user opt in
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- security see when last changed
    CONSTRAINT fk_user_status FOREIGN KEY (status_id) REFERENCES user_statuses(id), -- will not delete if used, check status id exists
    CONSTRAINT fk_user_type FOREIGN KEY (user_type_id) REFERENCES user_types(id) ON DELETE RESTRICT -- cannot delete if used, checks if exists
) ENGINE=InnoDB;

-- email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    user_id BIGINT UNSIGNED NOT NULL, -- not pk, user can have many tokens sent if resend
    token CHAR(64) PRIMARY KEY, -- pk, is unique
    expires_at DATETIME NOT NULL, -- set expiration
    used BOOLEAN NOT NULL DEFAULT FALSE, -- cant use same link twice
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- delete tokens if user deleted
) ENGINE=InnoDB;

-- home address
CREATE TABLE IF NOT EXISTS home_addresses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(50) DEFAULT 'home', -- default home addr
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_home_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_one_address_per_user UNIQUE (user_id) -- one addr constraint unique to user
) ENGINE=InnoDB;

-- billing addresses
CREATE TABLE IF NOT EXISTS billing_addresses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_billing_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_billing_addr_user (user_id)
) ENGINE=InnoDB;

-- payment cards (max 3)
CREATE TABLE IF NOT EXISTS payment_cards (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    brand ENUM('VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'OTHER') NOT NULL, -- enum since most common banks
    last4 CHAR(4) NOT NULL,
    exp_month TINYINT UNSIGNED NOT NULL CHECK (exp_month BETWEEN 1 AND 12),
    exp_year SMALLINT UNSIGNED NOT NULL,
    billing_address_id BIGINT UNSIGNED,
    token VARCHAR(255) NOT NULL, -- encrypted/tokenized card data
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_card_billing_addr FOREIGN KEY (billing_address_id) REFERENCES billing_addresses(id) ON DELETE SET NULL -- info null if deleted
) ENGINE=InnoDB;

-- num card limit 
DROP TRIGGER IF EXISTS trg_payment_cards_before_insert;
DELIMITER $$ -- run before inerted
CREATE TRIGGER trg_payment_cards_before_insert
BEFORE INSERT ON payment_cards
FOR EACH ROW
BEGIN
  DECLARE cnt INT; -- local var
  SELECT COUNT(*) INTO cnt FROM payment_cards WHERE user_id = NEW.user_id;
  IF cnt >= 3 THEN -- check 3 card limit
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already has maximum of 3 payment cards'; -- will not insert
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

-- extra for fast look up
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status_id);
CREATE INDEX idx_users_type ON users(user_type_id);