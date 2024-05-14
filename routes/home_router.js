const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {

    // console.log(req.session.userId);

    const sql = `
        SELECT * FROM games;
    `

    db.query(sql, (err, result) => {
        if (err) console.log(err);
        const games = result.rows
        res.render('home', { games: games})
    })
})

module.exports = router