const express = require('express')
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensureLoggedIn')
const userEditSelf = require('../middlewares/userEditSelf')
const router = express.Router()

router.get('/users/:id', (req, res) => {
    const sql = `SELECT * FROM users WHERE id = $1`

    db.query(sql, [req.params.id], (err, result) => {
        if (err) console.log(err);

        const user = result.rows[0]

        const sqlGames = `
            SELECT * FROM 
            usergamelist 
            JOIN games ON 
            (usergamelist.game_id = games.id) 
            JOIN users ON 
            (usergamelist.user_id = users.id) 
            WHERE users.id = $1
            ORDER BY games.title;
        `
        
        db.query(sqlGames, [req.params.id], (err, result) => {
            if (err) console.log(err);

            const games = result.rows

            res.render('users', { user: user,  games: games })
        })

    })
})

router.get('/users/:id/edit/profile', userEditSelf, (req, res) => {

    const sql = `SELECT * FROM users WHERE id = $1`

    db.query(sql, [req.params.id], (err, result) => {
        if (err) console.log(err);

        const user = result.rows[0]

        const sqlGames = `
            SELECT * FROM 
            usergamelist 
            JOIN games ON 
            (usergamelist.game_id = games.id) 
            JOIN users ON 
            (usergamelist.user_id = users.id) 
            WHERE users.id = $1
            ORDER BY games.title;
        `
        
        db.query(sqlGames, [req.params.id], (err, result) => {
            if (err) console.log(err);

            const games = result.rows

            res.render('edit_profile', { user: user,  games: games })
        })

    })
})

router.get('/users/:id/edit/games', userEditSelf, (req, res) => {

    const sql = `SELECT * FROM games ORDER BY title;`

    db.query(sql, (err, result) => {
        if (err) console.log(err);

        const allGames = result.rows
        
        const sqlGames = `
            SELECT 
            usergamelist.id AS usergameid, 
            usergamelist.user_id,
            usergamelist.game_id,
            usergamelist.remark,
            games.*, 
            users.* 
            FROM usergamelist
            JOIN games ON 
            (usergamelist.game_id = games.id) 
            JOIN users ON 
            (usergamelist.user_id = users.id) 
            WHERE users.id = $1
            ORDER BY games.title;
        `
        
        db.query(sqlGames, [req.params.id], (err, result) => {
            if (err) console.log(err);
    
            const games = result.rows
    
            res.render('edit_games', { allGames: allGames, games: games })
        })
    })
})

router.post('/users/:id/edit/games', ensureLoggedIn, (req, res) => {

    const gameId = req.body.gameId
    const remark = req.body.remark

    const sql = `
        INSERT INTO usergamelist
        (user_id, game_id, remark) 
        VALUES 
        ($1, $2, $3);
    `

    db.query(sql, [req.session.userId, gameId, remark], (err, result) => {
        if (err) console.log(err);
        
        sqlUpdatePlayerCount = `
            UPDATE games 
            SET player_count = player_count + 1 
            WHERE id = $1;
        `
        db.query(sqlUpdatePlayerCount, [gameId], (err, result) => {
            if (err) console.log(err);

            res.redirect(`/users/${req.session.userId}`)
        })
    })
})

router.delete('/users/:id/edit/games', ensureLoggedIn, (req, res) => {
    
    const userGameId = req.body.userGameId
    const gameId = req.body.gameId
    
    let sql = `
        DELETE FROM usergamelist WHERE id = $1;
    `

    db.query(sql, [userGameId], (err, result) => {
        if (err) console.log(err);

        sqlUpdatePlayerCount = `
            UPDATE games 
            SET player_count = player_count - 1 
            WHERE id = $1;
        `
        db.query(sqlUpdatePlayerCount, [gameId], (err, result) => {
            if (err) console.log(err);

            res.redirect(`/users/${req.session.userId}`)
        })
    })
})

router.put('/users/:id/edit/profile', (req, res) => {
    const username = req.body.username
    const imageUrl = req.body.profileImage
    const aboutMe = req.body.aboutMe

    const sql = `
        UPDATE users 
        SET username = $1, profile_image = $2, about_me = $3 
        WHERE id = $4;
    `

    db.query(sql, [username, imageUrl, aboutMe, req.session.userId], (err, result) => {
        if (err) console.log(err);

        res.redirect(`/users/${req.params.id}`)
    })
})

router.put('/users/:id/edit/games', (req, res) => {
    const remark = req.body.remark
    const userGameId = req.body.userGameId

    const sql = `
        UPDATE usergamelist SET remark = $1 WHERE id = $2;
    `

    db.query(sql, [remark, userGameId], (err, result) => {
        if (err) console.log(err);
        res.redirect(`/users/${req.params.id}`)
    })
})

module.exports = router