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

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const username = req.body.username
    const aboutMe = req.body.aboutMe
    const profileImage = req.body.profileImage

    const sql = `
        SELECT *
        FROM users
        WHERE email = $1;
    `

    db.query(sql, [email], (err, result) => {
        if (err) console.log(err);

        if (result.rows.length === 0) {
            const saltRounds = 10
            const sqlInsertNewUser = `
                INSERT INTO users (username, email, password_hashed, profile_image, about_me)
                VALUES ($1, $2, $3, $4, $5);
            `
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(password, salt, function(err, hash) {
                    db.query(sqlInsertNewUser, [username, email, hash, profileImage,aboutMe], (err, result) => {
                        if (err) console.log(err);
                        
                        const sql = `SELECT * FROM users WHERE email = $1 `

                        db.query(sql, [email], (err, result) => {
                            if (err) console.log(err);

                            req.session.userId = result.rows[0].id

                            res.redirect('/')
                        })

                    })
                })
            })
        } else {
            return res.render('login', { errorMessage: 'email is already used. Please log in'})
        }
    })
})


module.exports = router