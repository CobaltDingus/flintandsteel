const express = require('express')
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensureLoggedIn')
const userEditSelf = require('../middlewares/userEditSelf')
const setCurrentUser = require('../middlewares/setCurrentUser')
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

            const sqlChats = `
                SELECT 
                DISTINCT ON (receiver_id) * 
                FROM messages 
                JOIN users 
                ON messages.receiver_id = users.id
                WHERE sender_id = $1 OR receiver_id = $1;
            `

            db.query(sqlChats, [req.params.id], (err, result) => {
                if (err) console.log(err);

                const chats = result.rows

                res.render('users', { user: user,  games: games, chats: chats })
            })

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

router.post('/users/:id/edit/games', userEditSelf, (req, res) => {

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

router.delete('/users/:id/edit/games', userEditSelf, (req, res) => {
    
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

            res.redirect(`/users/${req.session.userId}/edit/games`)
        })
    })
})

router.put('/users/:id/edit/profile', userEditSelf, (req, res) => {
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

router.put('/users/:id/edit/games', userEditSelf, (req, res) => {
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

router.get('/users/:id/messages/:receiver_id', userEditSelf, (req, res) => {
    
    const sql = `
        SELECT
        date_trunc('second', time_posted),
        messages.sender_id, 
        messages.receiver_id, 
        messages.content,
        users.*
        FROM messages 
        JOIN users 
        ON sender_id = users.id
        WHERE (sender_id = $1 AND receiver_id = $2) 
        OR (sender_id = $2 AND receiver_id = $1) 
        ORDER BY messages.id;
    `

    db.query(sql, [req.session.userId, req.params.receiver_id], (err, result) => {
        if (err) console.log(err);

        const messages = result.rows

        const receiver_id = req.params.receiver_id

        res.render('message', { messages: messages, receiverId: receiver_id})
    })
})

router.post('/users/:id/messages/:receiver_id', userEditSelf, (req, res) => {
    const senderId = req.body.senderId
    const receiverId = req.body.receiverId
    const content = req.body.content

    const sql = `INSERT INTO messages (sender_id, receiver_id, content) 
    VALUES ($1, $2, $3);
    `

    db.query(sql, [senderId, receiverId, content], (err, result) => {
        if (err) console.log(err);

        res.redirect(`/users/${senderId}/messages/${receiverId}`)
    })
})

module.exports = router