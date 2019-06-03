const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const moviesRouter = require('./Routes/movies')
const charactersByMovieRouter = require('./Routes/characters')
const planets = require('./Routes/climates')

const app = express()
const port = process.env.PORT || 4000

app
    .use(bodyParser.json())
    .use(cors())
    .use(moviesRouter)
    .use(charactersByMovieRouter)
    .use(planets)
    .listen(port, () => console.log(`Listening to port ${port}`))