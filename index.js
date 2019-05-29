const express = require('express')
const bodyParser = require('body-parser')

const moviesRouter = require('./Routes/movies')

const app = express()
const port = process.env.PORT || 4000

app
    .use(bodyParser.json())
    .use(moviesRouter)
    .listen(port, () => console.log(`Listening to port ${port}`))