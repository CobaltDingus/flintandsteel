const express = require('express')
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensureLoggedIn')
const router = express.Router()

router.get('/dishes/:id', (req, res) => {
    const sql = `
        SELECT * FROM dishes WHERE id = $1;
    `

    const commentsSql = `
        SELECT * FROM comments 
        JOIN users
        ON comments.user_id = users.id
        WHERE dish_id = $1;
    `

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }

        const dish = result.rows[0]

        db.query(commentsSql, [req.params.id], (err, result) => {
            if (err) console.log(err);

            const comments = result.rows

            res.render('show', { dish: dish, comments: comments })
        })

    })
})

router.get('/share', ensureLoggedIn, (req, res) => {
    res.render('share')
})

router.post('/dishes', ensureLoggedIn, (req, res) => {
    // console.log(req.body);
    let title = req.body.title
    let imageUrl = req.body.imageUrl
    let description = req.body.description

    let sql = `
        INSERT INTO dishes 
        (title, image_url, description, user_id) 
        VALUES 
        ($1, $2, $3, $4);
    `

    db.query(sql, [title, imageUrl, description, req.session.userId], (err, result) => {
        if (err) {
            console.log(err);
        }

        // force user to make another request
        res.redirect('/')
    })

})

router.delete('/dishes/:id', (req, res) => {
    let sql = `
        DELETE FROM dishes WHERE id = $1;
    `

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/')
    })
})

router.get('/dishes/:id/edit', (req, res) => {
    let sql = `
        SELECT * FROM dishes WHERE id = $1;
    `
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        const dish = result.rows[0]
        res.render('edit', { dish: dish })
    })

})

router.put('/dishes/:id', (req, res) => {
    const title = req.body.title
    const imageURL = req.body.imageUrl
    const description = req.body.description

    const sql = `
        UPDATE 
            dishes
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
        res.redirect(`/dishes/${req.params.id}`)
    })
})

module.exports = router