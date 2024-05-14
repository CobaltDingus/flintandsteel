const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    const email = req.body.email
    const plainTextPassword = req.body.password

    if (email && email.length < 3) {
        return res.render('login', { errorMessage: 'email is too short'})
    }

    const sql = `
        SELECT *
        FROM users
        WHERE email = $1;
    `

    db.query(sql, [email], (err, result) => {
        if (err) console.log(err);

        if (result.rows.length === 0) {
            console.log('user not found');
            return res.render('login', { errorMessage: 'incorrect email or password'})
        }

        const hashedPassword = result.rows[0].password_hashed
        bcrypt.compare(plainTextPassword, hashedPassword, (err, isCorrect) => {
            if (err) console.log(err);

            if (!isCorrect) {
                console.log('password doesnt match');
                return res.render('login')
            }

            req.session.userId = result.rows[0].id

            res.redirect('/')
        })
    })
})

router.delete('/logout', (req, res) => {
    req.session.userId = null
    res.redirect('/login')
})

module.exports = router