CREATE DATABASE flintandsteel;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hashed TEXT NOT NULL
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    player_count INTEGER
);

CREATE TABLE usergamelist (
    id SERIAL PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
)

INSERT INTO users (username, email, password_hashed) VALUES (CobaltDingus, cobalt@gmail.com, $2b$10$hPcP7aXuHpTN7k9JJQLaKexvPhlO2LhgUGObDZSal/eKd3kVR1KMa)