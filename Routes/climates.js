const axios = require('axios')
const { Router } = require('express')
const router = new Router()


async function fetchMetaData() {
    const baseUrl = 'https://swapi.co/api/planets/';
    let allData = [];
    const total_pages = 7;
    let currentPage = 2;

    const dataFirstPage = await axios.get(baseUrl)
    let data = await dataFirstPage.data.results
    data.forEach(e => allData.unshift(e))
  
    while(currentPage <= total_pages) {
        const response = await axios.get(`${baseUrl}?page=${currentPage}`)
        let  data = await response.data.results;
        data.forEach(e => allData.unshift(e));
        currentPage++;
    }
    return allData;
}

//show all of Star Wars planets
router.get('/planets', (req, res) => {
    const data = fetchMetaData()
                .then(values => res.json(values))
    return data
}) 

//show all of Star Wars planets with climate search term
router.get('/planets/search', (req, res, next) => {
    let climate = req.query.climate.toLowerCase()

    const data = fetchMetaData()
                    .then(planets => {
                        if(climate === undefined){
                            return res.status(400).send({ message: "Bad request!"})
                        }
                        else if (climate === ""){
                            return res.status(400).send({ message: "Climate search term should not be empty!"})
                        }
                        else {
                            return planets.filter(planet => planet.climate.includes(climate))
                        }    
                    }) 
                    .then(foundPlanets => {
                        if(foundPlanets.length === 0){
                            return res.status(404).send({ message: `Not found any planets with ${climate} climate `})
                        } else {
                            return res.json({ planets: foundPlanets })
                        }
                    })
                
                .catch(err => console.error(err))
    return data
    
}) 


module.exports = router