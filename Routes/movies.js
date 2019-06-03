const axios = require('axios')
const { Router } = require('express')
const router = new Router()

const baseUrl = 'https://swapi.co/api/films/'

//show all of Star Wars films details
router.get('/movies', (req, res) => {
    axios
        .get(baseUrl)
        .then(response => response.data)
        .then(data => {
            const sortFilms = data.results.sort((a,b) => {
                return Number(a.episode_id) - Number(b.episode_id)
            })
            res.json(sortFilms)
        })
        .catch(err => console.error(err)) 
}) 

module.exports = router