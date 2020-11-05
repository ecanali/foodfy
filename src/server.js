const express = require('express')
const server = express()
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')

const routes = require('./routes')
const session = require('./config/session')

server.use(session)
// makes the "session" variable available globally (with access to all pages)
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
}) 
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.use((req, res) => 
    res.status(404).render('site/not-found'))

server.listen(3007, () => 
    console.log("server is running..."))