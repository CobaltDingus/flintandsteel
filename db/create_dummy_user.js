require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRounds = 10
const db = require('./index.js')

// const username = 'CobaltDingus'
// const email = 'cobalt@gmail.com'
// const plainTextPassword = 'gaming'

const sql = `
    INSERT INTO users (username, email, password_hashed) VALUES ($1, $2, $3);
`

const dummyEmails = [
    "dummy1@gmail.com",
    "dummy2@gmail.com",
    "dummy3@gmail.com",
    "dummy4@gmail.com",
    "dummy5@gmail.com",
    "dummy6@gmail.com",
    "dummy7@gmail.com",
    "dummy8@gmail.com",
    "dummy9@gmail.com"
  ];

const gamingUsernames = [
    "ShadowBladeX",
    "LunaWraith",
    "FrostByte",
    "NovaStrike",
    "SpecterHawk",
    "IronPhoenix",
    "ViperFang",
    "StormChaser",
    "BlazeFury"
  ];

const randomPasswords = [
    "Crimson",
    "Whisper",
    "Aurora",
    "Sapphire",
    "Thunder",
    "Cascade",
    "Mystic",
    "Inferno",
    "Celestial"
  ];

function singleUser() {
    const name = "bingbong"
    const email = "goon@gmail.com"
    const password = "Mystic"
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            db.query(sql, [name, email, hash], (err, result) => {
                if (err) console.log(err);
            })
        });
    });
}

function multipleUsers() {
    for (let i = 0; i < gamingUsernames.length; i++) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(randomPasswords[i], salt, function(err, hash) {
                // Store hash in your password DB.
                db.query(sql, [gamingUsernames[i], dummyEmails[i], hash], (err, result) => {
                    if (err) console.log(err);
                })
            });
        });
    }
}

singleUser()
// multipleUsers()