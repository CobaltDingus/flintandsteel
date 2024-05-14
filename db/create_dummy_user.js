require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRounds = 10
const db = require('./index.js')

const username = 'CobaltDingus'
const email = 'cobalt@gmail.com'
const plainTextPassword = 'gaming'

const sql = `
    INSERT INTO users (username, email, password_hashed) VALUES ($1, $2, $3);
`

bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(plainTextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        db.query(sql, [username, email, hash], (err, result) => {
            if (err) console.log(err);

            console.log(result.rows[0]);
        })
    });
});