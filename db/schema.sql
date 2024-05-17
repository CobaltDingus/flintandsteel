CREATE DATABASE flintandsteel;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hashed TEXT NOT NULL,
    profile_image TEXT,
    about_me TEXT
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
    user_id INTEGER,
    game_id INTEGER,
    remark TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT NOT NULL,
    time_posted TIMESTAMP DEFAULT now(),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id)
);

-- select date_trunc('second', time_posted) from messages;

-- INSERT INTO users (username, email, password_hashed) VALUES (CobaltDingus, cobalt@gmail.com, $2b$10$hPcP7aXuHpTN7k9JJQLaKexvPhlO2LhgUGObDZSal/eKd3kVR1KMa)

-- SELECT usergamelist.id,username,title FROM usergamelist JOIN games ON (usergamelist.game_id = games.id) JOIN users ON (usergamelist.user_id = users.id) ORDER BY user_id;