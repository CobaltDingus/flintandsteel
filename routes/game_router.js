const express = require('express')
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensureLoggedIn')
const router = express.Router()

router.get('/games/:id', (req, res) => {
    
    const gameId = req.params.id

    const sqlGameDetails = `
        SELECT * FROM games WHERE id = $1;
    `
    
    db.query(sqlGameDetails, [gameId], (err, result) => {
        if (err) console.log(err);
        
        const game = result.rows[0]
        
        const sqlGameUsers = `
            SELECT * 
            FROM usergamelist 
            JOIN users 
            ON (usergamelist.user_id = users.id) 
            WHERE game_id = $1;
        `
        db.query(sqlGameUsers, [gameId], (err, result) => {
            if (err) console.log(err);

            const gameUsers = result.rows

            res.render('show', { game: game, gameUsers: gameUsers })
        })

    })
})

router.post('/games', ensureLoggedIn, (req, res) => {
    // console.log(req.body);
    let title = req.body.title
    let imageUrl = req.body.imageUrl
    let description = req.body.description

    let sql = `
        INSERT INTO games 
        (title, image_url, description, user_id) 
        VALUES 
        ($1, $2, $3, $4);
    `

    db.query(sql, [title, imageUrl, description, req.session.userId], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.redirect('/')
    })

})

router.delete('/games/:id', (req, res) => {
    let sql = `
        DELETE FROM games WHERE id = $1;
    `

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/')
    })
})

router.put('/games/:id', (req, res) => {
    const title = req.body.title
    const imageURL = req.body.imageUrl
    const description = req.body.description

    const sql = `
        UPDATE 
            games
        SET 
            title = $1, 
            image_url = $2, 
            description = $3 
        WHERE 
            id = $4;
    `

    db.query(sql, [title, imageURL, description, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect(`/games/${req.params.id}`)
    })
})

module.exports = router