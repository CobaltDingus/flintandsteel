require('dotenv').config()
const db = require('./index.js')
const _ = require('lodash')

const userIdArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const gameIdArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const remarksArray = ['Need advice', 'Just chatting', 'Looking for teammates', 'New player']

const sql = `INSERT INTO usergamelist (user_id, game_id, remark) VALUES ($1, $2, $3);`

for (user of userIdArray) {
    const games = randomGames()
    for (game of games) {
        const gameId = game
        const remark = randomRemark()
        db.query(sql, [user, game, remark], (err, result) => {
            if (err) console.log(err);

            sqlUpdatePlayerCount = `
            UPDATE games 
            SET player_count = player_count + 1 
            WHERE id = $1;
            `

            db.query(sqlUpdatePlayerCount, [gameId], (err, result) => {
                if (err) console.log(err);
            })
        })
    }
}

function randomGames() {
    return _.shuffle(gameIdArray).splice(0, 5)
}

function randomRemark() {
    return remarksArray[_.random(0, remarksArray.length-1)]
}