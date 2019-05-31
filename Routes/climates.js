const axios = require('axios')
const { Router } = require('express')
const router = new Router()

async function fetchAllPlanets() {
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

//show all of Star Wars planets with climate search term and collection of dark-haired characters from that planet
router.get('/planets/search', (req, res, next) => {
    let climate = req.query.climate.toLowerCase()

    return fetchAllPlanets()
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
        .then(planetsFound => {
            if(planetsFound.length === 0){
                return res.status(404).send({ message: `Not found any planets with ${climate} climate `})
            } else {
                return planetsFound
            }   
        })
        .then(planets => {
            return planets.map(planet => {
                const peoplePromises =  planet.residents.map(url => axios.get(url))                
                
                return Promise.all(peoplePromises)
                    .then(responses => {
                        const darkHaired = responses
                            .filter(response => response.data.hair_color === 'brown' || response.data.hair_color === 'black')
                            .map(response => response.data)
                        planet.darkHairedPeople = darkHaired
                        return planet
                    })
                    .catch(err => console.error(err))
            })
        })
        .then(planetsWithDarkHaired => {
            Promise.all(planetsWithDarkHaired).then(planets => {
                return res.json({planets})
            })
            .catch(err => console.error(err))    
        })
        .catch(err => console.error(err))
}) 

module.exports = router