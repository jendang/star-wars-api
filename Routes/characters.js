const { Router } = require('express')
const axios = require('axios')
const router = new Router()
const pageData = require('../lib/pagedata')
const paginate = require('../lib/pagination')
const baseUrl = 'https://swapi.co/api/films/'

// Search movie by title => characters => filter "gender" => sort "height" OR "age"
router.get('/movies/search', (req, res) => {
    let { title, gender, sortHeight, sortAge } = req.query
    let limit = req.query.limit || 30
    let offset = req.query.offset || 0
    let page = req.query.page || 1
    axios
        .get(baseUrl)
        .then(response => response.data)
        .then(data => data.results)
        .then(movies => {
            if(title === undefined){
                res.status(400).send({ message: "Bad request!"})
            }
            else if (title === ""){
                res.status(400).send({ message: "Title search term should not be empty!"})
            }
            else {
                const titleQuery = title.toLowerCase()
                const movieFound =  movies.find(movie => {
                    const movieTitle = movie.title.toLowerCase()
                    if(movieTitle.includes(titleQuery)){
                        return movie 
                    }
                })
                if(movieFound === undefined){
                    res.status(404).send({ message: `Not found any movie with ${titleQuery} title `})
                }
                else {
                    const characters = movieFound.characters
                    const charactersPromises =  characters.map(url => axios.get(url))
                    
                    return Promise.all(charactersPromises).then(responses => {
                        const people = responses.map(response => response.data)
                     
                        if(gender === undefined){
                            
                            res.json({
                                "Movie: ": movieFound.title,
                                "Page data: ": pageData(limit, offset, people.length, parseInt(page)), 
                                "Characters: ": paginate(parseInt(page), people, limit)
                            })
                            
                        }
                        else if (gender === ""){
                            res.status(400).send({ message: "Search term should not be empty!"})
                        }
                        else {
                            const genderQuery = gender.toLowerCase()
                            const listPeopleByGender =  people.filter(character => character.gender === genderQuery)
                            
                            if(listPeopleByGender.length === 0){
                                res.status(404).send({ message: `Not found characters with that search term!`})
                            } else {
                                //List of people by filter gender (female/male)
                                //SORTING Height OR Age here
                                if(sortHeight === undefined && sortAge === undefined){
                                    res.json({
                                        "Movie: ": movieFound.title,
                                        "Page data: ": pageData(limit, offset, listPeopleByGender.length, parseInt(page)), 
                                        "Characters: ": paginate(parseInt(page), listPeopleByGender, limit)
                                    })

                                } 
                                else if (sortHeight !== undefined && sortAge === undefined){
                                    let sortHeightQuery = sortHeight.toLowerCase()
                                    if(sortHeightQuery === ""){
                                        res.status(400).send({ message: "Search term should not be empty!"})
                                    } 
                                    else if(sortHeightQuery !== 'asc' && sortHeightQuery !== 'desc') {    
                                        res.status(400).send({ message: "Bad request!"})
                                    } 
                                    else {
                                        const charsSortHeight = listPeopleByGender.sort((a,b) => {
                                            if(sortHeightQuery === 'asc'){
                                                return Number(a.height) - Number(b.height)
                                            } else {
                                                return Number(b.height) - Number(a.height)
                                            }
                                        })
                                        res.json({
                                            "Movie: ": movieFound.title,
                                            "Page data: ": pageData(limit, offset, charsSortHeight.length, parseInt(page)), 
                                            "Characters: ": paginate(parseInt(page), charsSortHeight, limit)
                                        })
                                    }
                                }
                                else if(sortHeight === undefined && sortAge !== undefined){
                                    let sortAgeQuery = sortAge.toLowerCase()
                                    if(sortAgeQuery === ""){
                                        res.status(400).send({ message: "Search term should not be empty!"})
                                    } 
                                    else if(sortAgeQuery !== 'asc' && sortAgeQuery !== 'desc') {    
                                        res.status(400).send({ message: "Bad request!"})
                                    } 
                                    else {
                                        const charsSortAge = listPeopleByGender.sort((a,b) => {
                                            if(sortAgeQuery === 'asc'){
                                                return parseInt(a.birth_year) - parseInt(b.birth_year)
                                            } else {
                                                return parseInt(b.birth_year) - parseInt(a.birth_year)
                                            }
                                        })
                                        
                                        res.json({
                                            "Movie: ": movieFound.title,
                                            "Page data: ": pageData(limit, offset, charsSortAge.length, parseInt(page)), 
                                            "Characters: ": paginate(parseInt(page), charsSortAge, limit)
                                        })
                                    }
                                }
                                else if (sortHeight !== undefined && sortAge !== undefined){
                                    res.status(400).send({ message: "You can sort either height or age per time"})
                                }
                            }
                        }
                    })
                    .catch(err => console.error(err))
                }
            }
        }) 
        .catch(err => console.error(err))        
})

module.exports = router