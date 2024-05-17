require('dotenv').config()

const express = require('express')
const methodOverride = require('method-override')
const app = express()
const port = 8080
const expressLayouts = require('express-ejs-layouts')
const gameRouter = require('./routes/game_router')
const sessionRouter = require('./routes/session_router')
const homeRouter = require('./routes/home_router')
const userRouter = require('./routes/user_router')
const session = require('express-session')
const setCurrentUser = require('./middlewares/setCurrentUser')

app.set('view engine', 'ejs')

app.use(expressLayouts)

app.use(express.static('public'))

app.use(methodOverride('_method'))

app.use(express.urlencoded())

app.use(session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 3 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
})) 

app.use(setCurrentUser)

app.use(homeRouter)
app.use(sessionRouter)
app.use(userRouter)
app.use(gameRouter)

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})  