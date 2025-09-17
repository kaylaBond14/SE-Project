USE ces;

-- halls for movie theater
CREATE TABLE IF NOT EXISTS halls (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    seat_rows SMALLINT UNSIGNED NOT NULL,
    seat_cols SMALLINT UNSIGNED NOT NULL
) ENGINE=InnoDB;

-- seats
CREATE TABLE IF NOT EXISTS seats (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    hall_id SMALLINT UNSIGNED NOT NULL,
    row_num SMALLINT UNSIGNED NOT NULL,
    col_num SMALLINT UNSIGNED NOT NULL,
    label VARCHAR(10),
    UNIQUE KEY uq_seat (hall_id, row_num, col_num),
    CONSTRAINT fk_seat_hall FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- show times/screenings
CREATE TABLE IF NOT EXISTS screenings (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    movie_id BIGINT UNSIGNED NOT NULL,
    hall_id SMALLINT UNSIGNED NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    is_canceled BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_scr_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_scr_hall FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Performance indexes
CREATE INDEX idx_screenings_starts_at ON screenings (starts_at);
CREATE INDEX idx_screenings_movie_date ON screenings (movie_id, starts_at);