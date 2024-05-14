const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {

    console.log(req.session.userId);

    const sql = `
        SELECT * FROM dishes JOIN users ON dishes.user_id = users.id ORDER BY dishes.id;
    `

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } 
        const dishes = result.rows
        res.render('home', { dishes: dishes})
    })
})

module.exports = router