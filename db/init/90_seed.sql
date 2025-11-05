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
('WELCOME10', '10% off for new customers', 'PERCENT', 10, 1000, NULL, '2024-01-01', '2025-12-31', TRUE);
-- ('SAVE5', '$5 off orders over $20', 'FIXED', 500, 2000, NULL, '2024-01-01', '2025-12-31', TRUE),
-- ('EARLYBIRD', '15% off matinee shows', 'PERCENT', 15, 0, NULL, '2024-01-01', '2025-12-31', TRUE);

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


-- Insert a basic hall for screenings
INSERT IGNORE INTO halls (name, seat_rows, seat_cols) VALUES
('Main Theater', 10, 12);

-- Insert seats for the hall (simplified - just first few rows)
INSERT IGNORE INTO seats (hall_id, row_num, col_num, label) VALUES
(1, 1, 1, 'A1'), (1, 1, 2, 'A2'), (1, 1, 3, 'A3'), (1, 1, 4, 'A4'), (1, 1, 5, 'A5'), (1, 1, 6, 'A6'),
(1, 1, 7, 'A7'), (1, 1, 8, 'A8'), (1, 1, 9, 'A9'), (1, 1, 10, 'A10'), (1, 1, 11, 'A11'), (1, 1, 12, 'A12'),
(1, 2, 1, 'B1'), (1, 2, 2, 'B2'), (1, 2, 3, 'B3'), (1, 2, 4, 'B4'), (1, 2, 5, 'B5'), (1, 2, 6, 'B6'),
(1, 2, 7, 'B7'), (1, 2, 8, 'B8'), (1, 2, 9, 'B9'), (1, 2, 10, 'B10'), (1, 2, 11, 'B11'), (1, 2, 12, 'B12'),
(1, 3, 1, 'C1'), (1, 3, 2, 'C2'), (1, 3, 3, 'C3'), (1, 3, 4, 'C4'), (1, 3, 5, 'C5'), (1, 3, 6, 'C6'),
(1, 3, 7, 'C7'), (1, 3, 8, 'C8'), (1, 3, 9, 'C9'), (1, 3, 10, 'C10'), (1, 3, 11, 'C11'), (1, 3, 12, 'C12'),
(1, 4, 1, 'D1'), (1, 4, 2, 'D2'), (1, 4, 3, 'D3'), (1, 4, 4, 'D4'), (1, 4, 5, 'D5'), (1, 4, 6, 'D6'),
(1, 4, 7, 'D7'), (1, 4, 8, 'D8'), (1, 4, 9, 'D9'), (1, 4, 10, 'D10'), (1, 4, 11, 'D11'), (1, 4, 12, 'D12'),
(1, 5, 1, 'E1'), (1, 5, 2, 'E2'), (1, 5, 3, 'E3'), (1, 5, 4, 'E4'), (1, 5, 5, 'E5'), (1, 5, 6, 'E6'),
(1, 5, 7, 'E7'), (1, 5, 8, 'E8'), (1, 5, 9, 'E9'), (1, 5, 10, 'E10'), (1, 5, 11, 'E11'), (1, 5, 12, 'E12'),
(1, 6, 1, 'F1'), (1, 6, 2, 'F2'), (1, 6, 3, 'F3'), (1, 6, 4, 'F4'), (1, 6, 5, 'F5'), (1, 6, 6, 'F6'),
(1, 6, 7, 'F7'), (1, 6, 8, 'F8'), (1, 6, 9, 'F9'), (1, 6, 10, 'F10'), (1, 6, 11, 'F11'), (1, 6, 12, 'F12'),
(1, 7, 1, 'G1'), (1, 7, 2, 'G2'), (1, 7, 3, 'G3'), (1, 7, 4, 'G4'), (1, 7, 5, 'G5'), (1, 7, 6, 'G6'),
(1, 7, 7, 'G7'), (1, 7, 8, 'G8'), (1, 7, 9, 'G9'), (1, 7, 10, 'G10'), (1, 7, 11, 'G11'), (1, 7, 12, 'G12'),
(1, 8, 1, 'H1'), (1, 8, 2, 'H2'), (1, 8, 3, 'H3'), (1, 8, 4, 'H4'), (1, 8, 5, 'H5'), (1, 8, 6, 'H6'),
(1, 8, 7, 'H7'), (1, 8, 8, 'H8'), (1, 8, 9, 'H9'), (1, 8, 10, 'H10'), (1, 8, 11, 'H11'), (1, 8, 12, 'H12'),
(1, 9, 1, 'I1'), (1, 9, 2, 'I2'), (1, 9, 3, 'I3'), (1, 9, 4, 'I4'), (1, 9, 5, 'I5'), (1, 9, 6, 'I6'),
(1, 9, 7, 'I7'), (1, 9, 8, 'I8'), (1, 9, 9, 'I9'), (1, 9, 10, 'I10'), (1, 9, 11, 'I11'), (1, 9, 12, 'I12'),
(1, 10, 1, 'J1'), (1, 10, 2, 'J2'), (1, 10, 3, 'J3'), (1, 10, 4, 'J4'), (1, 10, 5, 'J5'), (1, 10, 6, 'J6'),
(1, 10, 7, 'J7'), (1, 10, 8, 'J8'), (1, 10, 9, 'J9'), (1, 10, 10, 'J10'), (1, 10, 11, 'J11'), (1, 10, 12, 'J12');

-- Insert sample screenings (hardcoded showtimes as mentioned in requirements)
INSERT IGNORE INTO screenings (movie_id, hall_id, starts_at, ends_at) VALUES
-- Currently Running movies (past release dates)
(1, 1, '2024-09-17 14:00:00', '2024-09-17 16:28:00'), -- 2:00 PM
(1, 1, '2024-09-17 17:00:00', '2024-09-17 19:28:00'), -- 5:00 PM  
(1, 1, '2024-09-17 20:00:00', '2024-09-17 22:28:00'), -- 8:00 PM
(2, 1, '2024-09-17 14:30:00', '2024-09-17 17:26:00'),
(2, 1, '2024-09-17 18:00:00', '2024-09-17 20:56:00'),
(3, 1, '2024-09-17 15:00:00', '2024-09-17 17:10:00'),
(3, 1, '2024-09-17 19:30:00', '2024-09-17 21:40:00'), 
(4, 1, '2025-11-25 14:00:00', '2025-11-25 16:00:00'),
(4, 1, '2025-11-25 17:00:00', '2025-11-25 19:00:00'),
(5, 1, '2025-12-21 14:00:00', '2025-12-21 17:00:00'),
(5, 1, '2025-12-21 18:00:00', '2025-12-21 21:00:00'),
(6, 1, '2025-05-17 14:00:00', '2025-05-17 15:50:00'),
(6, 1, '2025-05-17 18:00:00', '2025-05-17 19:50:00'),
(7, 1, '2025-11-08 14:00:00', '2025-11-08 15:41:00'),
(7, 1, '2025-11-08 19:00:00', '2025-11-08 20:41:00'),
(8, 1, '2025-11-22 13:00:00', '2025-11-22 15:18:00'),
(8, 1, '2025-11-22 16:00:00', '2025-11-22 18:18:00'),
(9, 1, '2025-04-07 14:00:00', '2025-04-07 15:33:00'),
(9, 1, '2025-04-07 20:00:00', '2025-04-07 21:33:00'), 
(10, 1, '2026-02-14 14:00:00', '2026-02-14 16:09:00'),
(10, 1, '2026-02-14 19:00:00', '2026-02-14 21:09:00');