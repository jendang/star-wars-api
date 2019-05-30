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
            res.json(data.results)
        })
        .catch(err => console.error(err)) 
}) 

module.exports = router