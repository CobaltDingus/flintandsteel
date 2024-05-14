const express = require('express')
const router = express.Router()
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensureLoggedIn')

router.post('/comments', ensureLoggedIn, (req, res) => {
    const content = req.body.content
    const dishId = req.body.dish_id


    const sql = `
        INSERT INTO comments (content, dish_id, user_id) VALUES ($1, $2, $3)
    `

    db.query(sql, [content, dishId, req.session.userId], (err, result) => {
        if (err) console.log(err)

        res.redirect(`dishes/${dishId}`)
    })
})

module.exports = router