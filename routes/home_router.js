const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {

    const sql = `
        SELECT * FROM games ORDER BY player_count DESC;
    `

    db.query(sql, (err, result) => {
        if (err) console.log(err);
        const games = result.rows
        res.render('index', { games: games })
    })
})

router.get('/about', (req, res) => {
    res.render('about')
})

module.exports = router