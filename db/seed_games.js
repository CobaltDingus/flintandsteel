require('dotenv').config()
const db = require('./index.js')
const _ = require('lodash')

const randomGameArray = ["Mario Kart", "Garfield Kart", "DOOM Eternal", "Animal Crossing: New Horizons", "Final Fantasy VII", "League of Legends", "Dota 2", "Minecraft", "Terraria", "Subnautica", "The Elder Scrolls V: Skyrim", "Valorant", "Genshin Impact", "Honkai: Star Rail", "Baldur's Gate 3"] 
const dummyDescription = `Step into the world of [Game Title], a thrilling [Genre] adventure designed for [Number of Players]. Dive into a captivating journey filled with [unique feature or setting]. Whether you're playing solo or teaming up with friends, [Game Title] offers an immersive experience like no other.`
const dummyImage = 'https://fakeimg.pl/400x400?text=Game&font=bebas'

const sql = `INSERT INTO games (title, description, image_url) VALUES ($1, $2, $3) RETURNING *;`

for (let game of randomGameArray) {
    db.query(sql, [game, dummyDescription, dummyImage], (err, result) => {
        if (err) console.log(err);
    })
}




const sqlUserGame = `INSERT INTO usergamelist (user_id, game_id) VALUES ($1, $2);`