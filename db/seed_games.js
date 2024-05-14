require('dotenv').config()
const db = require('./index.js')
const _ = require('lodash')

const randomGameArray = ["Mario Kart", "Garfield Kart", "DOOM Eternal", "Animal Crossing: New Horizons", "Final Fantasy VII", "League of Legends", "Dota 2", "Minecraft", "Terraria", "Subnautica", "The Elder Scrolls V: Skyrim", "Valorant", "Genshin Impact", "Honkai: Star Rail", "Baldur's Gate 3"] 
const dummyDescription = 'Engineer Gaming'
const dummyImage = 'https://fakeimg.pl/400x400?text=Game&font=bebas'

const sql = `INSERT INTO games (title, description, image_url) VALUES ($1, $2, $3) RETURNING *;`

for (let game of randomGameArray) {
    db.query(sql, [game, dummyDescription, dummyImage], (err, result) => {
        if (err) console.log(err);
    })
}

// for (let i = 0; i < 10; i++) {
//     const dummyTitle = randomFoodArray[Math.floor(Math.random() * randomFoodArray.length)]
//     db.query(sql, [dummyTitle, dummyDescription, dummyImage], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result.rows[0]);
//     })
// }