USE ces;
-- movie categories
CREATE TABLE IF NOT EXISTS categories (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;
-- movie ratings
CREATE TABLE IF NOT EXISTS us_ratings (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code ENUM('G','PG','PG-13','R', 'NC-17', 'NR') NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB;
-- movie info
CREATE TABLE IF NOT EXISTS movies (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    rating_id TINYINT UNSIGNED,
    trailer_url VARCHAR(1024),
    poster_url VARCHAR(1024),
    runtime_min SMALLINT UNSIGNED,
    release_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_movie_rating FOREIGN KEY (rating_id) REFERENCES us_ratings(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
-- movie categories
CREATE TABLE IF NOT EXISTS movie_categories (
    movie_id BIGINT UNSIGNED NOT NULL,
    category_id TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (movie_id, category_id),
    CONSTRAINT fk_mc_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_mc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
-- cast
CREATE TABLE IF NOT EXISTS people (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    UNIQUE KEY uq_person_name (name)
) ENGINE=InnoDB;
-- movie roles
CREATE TABLE IF NOT EXISTS movie_people (
    movie_id BIGINT UNSIGNED NOT NULL,
    person_id BIGINT UNSIGNED NOT NULL,
    role ENUM('cast', 'director', 'producer') NOT NULL,
    character_name VARCHAR(200),
    PRIMARY KEY (movie_id, person_id, role),
    CONSTRAINT fk_mp_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_mp_person FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- movie reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    movie_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_movie (user_id, movie_id),
    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5), 
    CONSTRAINT fk_rev_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rev_movie FOREIGN KEY (movie_id) REFERENCES movies(id) On DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_movies_release_date ON movies (release_date);
CREATE INDEX idx_movies_rating ON movies (rating_id);
CREATE INDEX idx_reviews_movie ON reviews(movie_id);