USE ces;

-- Insert movie categories/genres for filtering
INSERT IGNORE INTO categories (title) VALUES
('Action'),
('Comedy'),
('Drama'),
('Horror'),
('Sci-Fi'),
('Romance'),
('Thriller'),
('Animation');

-- Insert sample movies for home page
INSERT IGNORE INTO movies (title, synopsis, rating, trailer_url, poster_url, runtime_min, release_date) VALUES
('The Martian', 'When astronauts blast off from the planet Mars, they leave behind Mark Watney, presumed dead after a feirce storm. With only a meager amount of supplies, the stranded visitor must utilize hos wits and spirit to find a way to survive on the hostile planet. Meanwhile, back on Earth, members of NASA and a team of international scientists work tirelessly to bring him home, while his crew mates hatch their own plan for a daring rescue mission.', 'PG-13', 'https://www.youtube.com/watch?v=ej3ioOneTy8', 'https://i.ebayimg.com/images/g/c-gAAOSwJ4ZjBkJU/s-l1200.jpg', 151, '2015-10-02'),
('Despicable Me 4', 'Gru welcomes a new member to the family, Gru Hr., who''s intent on tormenting his dad. However, their peaceful existence soon comes crashing down when criminal mastermind Maxime Le Mal escapes from prison and vows revenge against Gru.', 'PG', 'https://www.youtube.com/watch?v=qQlr9-rF32A', 'https://img.vwassets.com/thevic.co.nz/vertical_40eb110a-5d4b-4f86-907b-2f37ee4ec8f0.jpg', 94, '2024-07-03'),
('Top Gun: Maverick', 'After more than 30 years of service as one of the Navy''s top aviators, Pete "Maverick" Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him. Training a detachment of graduates for a special assignment, Maverick must confront the ghosts of his past and his deepest fears, culminating in a mission that demands the ultimate sacrifice from those who choose to fly it.', 'PG-13', 'https://www.youtube.com/watch?v=giXco2jaZ_4', 'https://ae01.alicdn.com/kf/Seaf229d727b84096b6be6bbffa9d0098F.jpg', 130, '2022-05-27'),
('The Accountant 2', 'Christian Wolff applies his brilliant mind and illegal methods to reconstruct the unsolved puzzle of a Treasury chief''s murder.', 'R', 'https://www.youtube.com/watch?v=3wRCOqyDI6E', 'https://resizing.flixster.com/uryKtE0AZYs_so1mlw1yPA3pdSE=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzkwMmRlYWIzLThiNTQtNGIyZi05ODRlLWMxZDM3ZmY2ZTU4My5qcGc=', 134, '2025-04-25'),
('Avatar 3', 'Jake Sully continues his journey on Pandora.', 'PG-13', 'https://www.youtube.com/watch?v=nb_fFj_0rq8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ZoqQixChAruKeUxEacElcI6wRJr_TJVmTw&s', 180, '2025-12-20');

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
(5, 5); -- Avatar 3: Sci-Fi

-- Insert a basic hall for screenings
INSERT IGNORE INTO halls (name, seat_rows, seat_cols) VALUES
('Main Theater', 10, 12);

-- Insert seats for the hall (simplified - just first few rows)
INSERT IGNORE INTO seats (hall_id, row_num, col_num, label) VALUES
(1, 1, 1, 'A1'), (1, 1, 2, 'A2'), (1, 1, 3, 'A3'), (1, 1, 4, 'A4'),
(1, 2, 1, 'B1'), (1, 2, 2, 'B2'), (1, 2, 3, 'B3'), (1, 2, 4, 'B4'),
(1, 3, 1, 'C1'), (1, 3, 2, 'C2'), (1, 3, 3, 'C3'), (1, 3, 4, 'C4');

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
-- Coming Soon movies (future release dates)  
(4, 1, '2025-11-25 14:00:00', '2025-11-25 16:00:00'),
(4, 1, '2025-11-25 17:00:00', '2025-11-25 19:00:00'),
(5, 1, '2025-12-21 14:00:00', '2025-12-21 17:00:00'),
(5, 1, '2025-12-21 18:00:00', '2025-12-21 21:00:00');