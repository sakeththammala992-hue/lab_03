DROP TABLE IF EXISTS book;

CREATE TABLE book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);

INSERT INTO book (title, author, price, pages) VALUES
  ('Python Crash Course', 'Eric Matthes', 699, 544),
  ('Automate the Boring Stuff with Python', 'Al Sweigart', 549, 592),
  ('Introduction to Algorithms', 'Thomas H. Cormen', 1499, 1312),
  ('Grokking Algorithms', 'Aditya Bhargava', 499, 256),
  ('Code Complete', 'Steve McConnell', 1099, 960),
  ('The Mythical Man-Month', 'Frederick P. Brooks', 625, 336),
  ('Database System Concepts', 'Abraham Silberschatz', 1249, 1376),
  ('Computer Networking: A Top-Down Approach', 'James F. Kurose', 1350, 864),
  ('Operating System Concepts', 'Abraham Silberschatz', 1199, 1264),
  ('Fluent Python', 'Luciano Ramalho', 899, 1014);
