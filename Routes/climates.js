const axios = require('axios')
const { Router } = require('express')
const router = new Router()
const pageData = require('../lib/pagedata')
const paginate = require('../lib/pagination')

async function fetchAllPlanets() {
    const baseUrl = 'https://swapi.co/api/planets/'
    let allData = []
    const total_pages = 7
    let currentPage
    currentPage === undefined ? currentPage = 1 : currentPage = 2

    while(currentPage <= total_pages) {
        const response = await axios.get(`${baseUrl}?page=${currentPage}`)
        let  data = await response.data.results // array of planets
        data.forEach(e => allData.unshift(e))
        currentPage ++
    }
    return allData;
}



//show all of Star Wars planets
router.get('/planets', (req, res) => {
    let limit = req.query.limit || 30
    let offset = req.query.offset || 0
    let page = req.query.page || 1

    const data = fetchAllPlanets()
        .then(values => {
            const getPageData = pageData(limit, offset, values.length, page)
            if(getPageData.page > getPageData.page_count){
                return res.status(404).send({ message: `This data has only ${getPageData.page_count} pages`})
            }
            res.json({
                pageData: getPageData,
                planets: paginate(parseInt(page), values, parseInt(limit))
            })
            
        })
    return data
}) 

//show all of Star Wars planets with climate search term 
//and collection of darkHaired characters from that planet

router.get('/planets/search', (req, res) => {
    let {climate} = req.query
    // Handle error
    if(climate === undefined){
        return res.status(400).send({ message: "Bad request!"})
    }
    if (climate === ""){
        return res.status(400).send({ message: "Climate search term should not be empty!"})
    }

    return fetchAllPlanets()
        .then(planets => {
            let climateQuery = climate.toLowerCase()
            const planetsByClimate = planets.filter(planet => {
                const planetClimate = planet.climate.split(", ")
                return planetClimate.includes(climateQuery)
            }) 
            if (planetsByClimate.length === 0){
                return res.status(404).send({ 
                    message: `Not found any planets with ${climateQuery} climate type`
                })
            }
            return planetsByClimate
        }) 
        .then(planetsFound => {
            const planetsWithDarkHaired = planetsFound.map(planet => {
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

            Promise.all(planetsWithDarkHaired).then(planets => {
                return res.json({
                    planets: planets
                })
            })
            .catch(err => console.error(err)) 

        })
        .catch(err => console.error(err))        
        
}) 

module.exports = router