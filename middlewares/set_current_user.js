const db = require('../db')

function setCurrentUser(req, res, next) {
    //making the current user object available in every template
    res.locals.currentUser = {}
    res.locals.isLoggedIn = false

    // if the user is not logged in
    if (!req.session.userId) {
        return next()
    }

    // fetch user record from database
    const sql = `
        SELECT * FROM users WHERE id = $1;
    `

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) console.log(err);

        let user = result.rows[0]

        res.locals.currentUser = user
        res.locals.isLoggedIn = true
        next()
    })

}

module.exports = setCurrentUser