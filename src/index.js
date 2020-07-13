const path = require('path')
const express = require('express')
require('./db/mongoose')
const hbs = require('hbs')
const uiRouter = require('./routers/ui')
const studentRouter = require('./routers/student')
const staffRouter = require('./routers/staff')
const scoreRouter = require('./routers/score')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(uiRouter)
app.use(studentRouter)
app.use(staffRouter)
app.use(scoreRouter)

module.exports = app