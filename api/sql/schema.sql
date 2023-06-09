DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rooms;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    display TEXT,
    password TEXT,
    isAdmin BOOLEAN DEFAULT 0
);
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER UNIQUE,
    display TEXT,
    inputId TEXT
);
