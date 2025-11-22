USE ces;

-- user types
INSERT INTO user_types (type_name, description) VALUES
('Admin', 'System administrator with full access'),
('Customer', 'Regular customer user');

-- user statuses
INSERT INTO user_statuses (status_name, description) VALUES
('Active', 'Active user with full access'),
('Inactive', 'Inactive or unverified user'),
('Suspended', 'Suspended user, access denied');

-- admin credintials 
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    status_id,
    user_type_id,
    is_verified,
    reset_token,
    verification_token,
    account_suspended,
    promo_opt_in
) VALUES (
    'cinemaebookingteam2@gmail.com',
    '$2a$10$LKsImqbKJx37mZoF8bcfEOIKbtuIqiRIP.NuX5Fhp9l3gaJWtUIve', -- Team2admin! as password
    'System',
    'Administrator',
    '000-000-0000',
    1,
    1,
    TRUE,
    '',
    '',
    FALSE,
    FALSE
),
(
    'kayla14bond@gmail.com',
    '$2a$10$M9Rp8oiSUvMXYRkw304tyuS/gNxWWTYKiYMfFjeH/llPiYM8GVYt6', -- Team2customer!
    'Kayla',
    'Bond',
    '111-111-1111',
    1,
    2,
    TRUE,
    '',
    '',
    FALSE,
    TRUE
);
-- Customer 1 home address
INSERT INTO home_addresses (
    user_id,
    label,
    street,
    city,
    state,
    postal_code,
    country
) VALUES (
    (SELECT id FROM users WHERE email = 'kayla14bond@gmail.com'),
    'home',
    '789 Seed St',
    'Athens',
    'GA',
    '30605',
    'USA'
);
-- Customer 1 billing address
INSERT INTO billing_addresses (
    user_id,
    street,
    city,
    state,
    postal_code,
    country
) VALUES (
    (SELECT id FROM users WHERE email = 'kayla14bond@gmail.com'),
    '123 Test Ln',
    'Athens',
    'GA',
    '30606',
    'USA'
);
-- Customer 1 payment card
INSERT INTO payment_cards (
    user_id,
    brand,
    last4,
    exp_month,
    exp_year,
    billing_address_id,
    token
) VALUES (
    (SELECT id FROM users WHERE email = 'kayla14bond@gmail.com'),
    'VISA',
    '1234',
    12,
    2027,
    (SELECT id FROM billing_addresses 
     WHERE user_id = (SELECT id FROM users WHERE email = 'kayla14bond@gmail.com')
     ORDER BY id LIMIT 1),
    'TOKEN_1234'
);


-- Insert movie categories/genres for filtering
INSERT IGNORE INTO categories (title) VALUES
('Action'),
('Comedy'),
('Drama'),
('Horror'),
('Sci-Fi'),
('Romance'),
('Thriller'),
('Animation'),
('Musical');

-- ratings
INSERT INTO us_ratings (code, description) VALUES
('G', 'General Audiences - All ages admitted'),
('PG', 'Parental Guidance Suggested'),
('PG-13', 'Parents Strongly Cautioned - Some material may be inappropriate for children under 13'),
('R', 'Restricted - Under 17 requires accompanying parent or adult guardian'),
('NC-17', 'No One 17 and Under Admitted'),
('NR', 'Not Rated');

-- age categories
INSERT INTO age_categories (classification, min_age, max_age, description) VALUES
('CHILD', 0, 12, 'Children ages 0-12'),
('ADULT', 13, 64, 'Adults ages 13-64'),
('SENIOR', 65, NULL, 'Seniors 65 and older');

-- fees
INSERT INTO fees (name, amount, effective_on, active) VALUES
('Online Booking Fee', 150, '2024-01-01', TRUE),  -- 1.50 per transaction
('Processing Fee', 50, '2024-01-01', TRUE);       -- .50 per transaction

-- promotions
INSERT INTO promotions (code, description, discount_type, discount_value, min_purchase_amount, max_uses, starts_on, ends_on, active) VALUES
('WELCOME10', '10% off for new customers', 'PERCENT', 10, 1000, NULL, '2024-01-01', '2025-12-31', TRUE),
('SAVE5', '$5 off orders over $20', 'FIXED', 500, 2000, NULL, '2024-01-01', '2025-12-31', TRUE),
('EARLYBIRD', '15% off early shows', 'PERCENT', 15, 0, NULL, '2024-01-01', '2025-12-31', TRUE);

-- pricing
INSERT INTO ticket_prices (age_classification, price, effective_on) VALUES
('CHILD', 850, '2024-01-01'),    -- 8.50
('ADULT', 1250, '2024-01-01'),   -- 12.50
('SENIOR', 950, '2024-01-01');   -- 9.50

-- Insert sample movies for home page
INSERT INTO movies (title, synopsis, rating_id, trailer_url, poster_url, runtime_min, release_date) VALUES
('The Martian', 'When astronauts blast off from the planet Mars, they leave behind Mark Watney, presumed dead after a feirce storm. With only a meager amount of supplies, the stranded visitor must utilize hos wits and spirit to find a way to survive on the hostile planet. Meanwhile, back on Earth, members of NASA and a team of international scientists work tirelessly to bring him home, while his crew mates hatch their own plan for a daring rescue mission.', 3, 'https://www.youtube.com/watch?v=ej3ioOneTy8', 'https://i.ebayimg.com/images/g/c-gAAOSwJ4ZjBkJU/s-l1200.jpg', 151, '2015-10-02'),
('Despicable Me 4', 'Gru welcomes a new member to the family, Gru Hr., who''s intent on tormenting his dad. However, their peaceful existence soon comes crashing down when criminal mastermind Maxime Le Mal escapes from prison and vows revenge against Gru.', 2, 'https://www.youtube.com/watch?v=qQlr9-rF32A', 'https://img.vwassets.com/thevic.co.nz/vertical_40eb110a-5d4b-4f86-907b-2f37ee4ec8f0.jpg', 94, '2024-07-03'),
('Top Gun: Maverick', 'After more than 30 years of service as one of the Navy''s top aviators, Pete "Maverick" Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him. Training a detachment of graduates for a special assignment, Maverick must confront the ghosts of his past and his deepest fears, culminating in a mission that demands the ultimate sacrifice from those who choose to fly it.', 3, 'https://www.youtube.com/watch?v=giXco2jaZ_4', 'https://ae01.alicdn.com/kf/Seaf229d727b84096b6be6bbffa9d0098F.jpg', 130, '2022-05-27'),
('The Accountant 2', 'Christian Wolff applies his brilliant mind and illegal methods to reconstruct the unsolved puzzle of a Treasury chief''s murder.', 4, 'https://www.youtube.com/watch?v=3wRCOqyDI6E', 'https://resizing.flixster.com/uryKtE0AZYs_so1mlw1yPA3pdSE=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzkwMmRlYWIzLThiNTQtNGIyZi05ODRlLWMxZDM3ZmY2ZTU4My5qcGc=', 134, '2025-04-25'),
('Avatar 3', 'Jake Sully continues his journey on Pandora.', 3, 'https://www.youtube.com/watch?v=nb_fFj_0rq8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ZoqQixChAruKeUxEacElcI6wRJr_TJVmTw&s', 180, '2025-12-20'),
('Final Destination: Bloodlines', 'Plagued by a violent and recurring nightmare, a college student heads home to track down the one person who might be able to break the cycle of death and save her family from the grisly demise that inevitably awaits them all.', 4, 'https://www.youtube.com/watch?v=UWMzKXsY9A4', 'https://upload.wikimedia.org/wikipedia/en/a/ab/Final_Destination_Bloodlines_%282025%29_poster.jpg', 110, '2025-05-16'),
('The Running Man', 'In the near-future, "The Running Man" is the top-rated show on television, a deadly competition where contestants must survive 30 days while being hunted by professional assassins. Desperate for money to save his sick daughter, Ben Richards is convinced by the show''s ruthless producer to enter the game as a last resort. Ratings soon skyrocket as Ben''s defiance, instincts and grit turn him into an unexpected fan favorite, as well as a threat to the entire system.', 4,'https://www.youtube.com/watch?v=KD18ddeFuyM', 'https://m.media-amazon.com/images/M/MV5BMTczMzFjOTUtNGRlZS00MDM3LWExYjEtYWYxZDNmNzI2YTRmXkEyXkFqcGc@._V1_.jpg', 101, '2025-11-07'),
('Wicked: For Good', 'Now demonized as the Wicked Witch of the West, Elphaba lives in exile in the Ozian forest, while Glinda resides at the palace in Emerald City, reveling in the perks of fame and popularity. As an angry mob rises against the Wicked Witch, she''ll need to reunite with Glinda to transform herself, and all of Oz, for good.', 2, 'https://www.youtube.com/watch?v=pqi45Qhq3CI', 'https://m.media-amazon.com/images/M/MV5BNzRhNTE4ZTYtNTM0Mi00MzU3LTk4MTktYWE3MzQ2NTU0MDNlXkEyXkFqcGc@._V1_.jpg', 138, '2025-11-21'),
('The Bride', 'In 1930s Chicago, a scientist brings a murdered woman back to life to be a companion for Frankenstein''s monster.', 4,'https://www.youtube.com/watch?v=BuHjcBd20Mo', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTQ5EX5O4Hng9-H6G1ZoNyOGXDdmeVnEXM6yFYkggKHEk9S6Vo9_O_2nEwHKUaaK-cutQAcJjHcJ2d-JLab91Z33vB_-slavg', 93, '2025-04-06'),
('Wuthering Heights', 'Tragedy strikes when Heathcliff falls in love with Catherine Earnshaw, a woman from a wealthy family in 18th-century England.', 3, 'https://www.youtube.com/watch?v=ID0rqEWrN44', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-pOZkbp-3xINdt-anYnBJJdYQwgqtJQMpI1m4NejNd8gv-JWcfB1dOeFEYC-XmiBt0UPd4oTH2shNBoN0SNUaLjdgE2FSVA', 129, '2026-02-13');

-- Link movies to categories
INSERT IGNORE INTO movie_categories (movie_id, category_id) VALUES
(1, 5), -- The Martian: Sci-Fi
(2, 2), -- Despicable Me 4: Comedy
(2, 8), -- Despicable Me 4: Animation
(3, 1), -- Top Gun: Action
(3, 3), -- Top Gun: Drama
(4, 1), -- Accountant 2: Action
(4, 3), -- Accountant 2: Drama
(4, 7), -- Accountant 2: Thriller
(5, 1), -- Avatar 3: Action
(5, 5), -- Avatar 3: Sci-Fi
(6, 4), -- Final Destination: Horror
(7, 1), -- The running man: Action
(7, 5), -- The Running Man: Sci-Fi
(7, 7), -- The Running Man: Thriller
(8, 3), -- Wicked: Drama
(8, 9), -- Wicked: Musical
(9, 6), -- The Bride: Romance
(9, 4), -- The Bride: Horror
(10, 6); -- Wuthering Heights: Romance


-- Insert halls for screenings
INSERT IGNORE INTO halls (name, seat_rows, seat_cols) VALUES
('Hall A - Main Theater', 10, 12),
('Hall B - IMAX', 15, 20),
('Hall C - VIP', 6, 8);

-- Generate seats for the halls 
INSERT IGNORE INTO seats (hall_id, row_num, col_num, label)
SELECT 
    h.id AS hall_id,
    r.n AS row_num,
    c.n AS col_num,
    CONCAT(CHAR(64 + r.n), c.n) AS label
FROM halls h
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
    SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL
    SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
) AS r
    ON r.n <= h.seat_rows
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
    SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL
    SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL
    SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
) AS c
    ON c.n <= h.seat_cols;


-- Insert sample screenings 
INSERT IGNORE INTO screenings (movie_id, hall_id, starts_at, ends_at) VALUES
-- The Martian
(1, 1, '2025-11-05 14:00:00', '2025-11-05 16:31:00'),
(1, 2, '2025-12-21 20:00:00', '2025-12-21 22:31:00'),
-- Despicable Me 4
(2, 2, '2025-11-05 17:00:00', '2025-11-05 18:34:00'),
(2, 3, '2026-01-05 14:00:00', '2026-01-05 15:34:00'),
-- Top Gun: Maverick
(3, 1, '2025-11-06 14:00:00', '2025-11-06 16:10:00'),
(3, 3, '2025-11-06 17:00:00', '2025-11-06 19:10:00'),
-- The Accountant 2
(4, 2, '2025-11-07 14:00:00', '2025-11-07 16:14:00'),
(4, 1, '2025-12-22 17:00:00', '2025-12-22 19:14:00'),
-- Avatar 3 (releases 2025-12-20)
(5, 1, '2025-12-21 14:00:00', '2025-12-21 17:00:00'),
(5, 2, '2025-12-21 17:00:00', '2025-12-21 20:00:00'),
-- Final Destination: Bloodlines
(6, 3, '2025-11-08 14:00:00', '2025-11-08 15:50:00'),
(6, 2, '2026-01-06 20:00:00', '2026-01-06 21:50:00'),
-- The Running Man (101 min, released 2025-11-07)
(7, 1, '2025-11-08 17:00:00', '2025-11-08 18:41:00'),
(7, 1, '2026-01-07 20:00:00', '2026-01-07 21:41:00'),
-- Wicked: For Good (releases 2025-11-21)
(8, 2, '2025-11-22 14:00:00', '2025-11-22 16:18:00'),
(8, 2, '2026-01-05 20:00:00', '2026-01-05 22:18:00'),
-- The Bride 
(9, 3, '2025-12-22 14:00:00', '2025-12-22 15:33:00'),
(9, 3, '2026-01-08 17:00:00', '2026-01-08 18:33:00'),
-- Wuthering Heights (releases 2026-02-13)
(10, 1, '2026-02-14 14:00:00', '2026-02-14 16:09:00'),
(10, 3, '2026-02-14 17:00:00', '2026-02-14 19:09:00');