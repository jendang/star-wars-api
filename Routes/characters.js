const { Router } = require('express')
const axios = require('axios')
const router = new Router()

const baseUrl = 'https://swapi.co/api/films/'

// Search movie by title => characters => filter "gender" => sort "height" OR "age"
router.get('/movies/search', (req, res) => {
    let { title, gender, sortHeight, sortAge } = req.query
    
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
                
                //console.log(movieFound)

                if(movieFound === undefined){
                    res.status(404).send({ message: `Not found any movie with ${titleQuery} title `})
                }
                else {
                    const characters = movieFound.characters
                    const charactersPromises =  characters.map(url => axios.get(url))
                    
                    return Promise.all(charactersPromises).then(responses => {
                        
                        const people = responses.map(response => response.data)
                        let totalCharacters = people.length
                        let pageCount = Math.ceil(people.length / 30);
                        let page = parseInt(req.query.p);
                        if (!page) { page = 1;}
                        if (page > pageCount) {
                          page = pageCount
                        }

                        const titleUrl = titleQuery.split(" ").join("+")
                        
                        if(gender === undefined){
                            //res.json(people)
                            res.json({
                                "Total characters": totalCharacters,
                                "Page": page,
                                "Page Count": pageCount,
                                "Previous page": `http://localhost:4000/movies/search?title=${titleUrl}&p=${page - 1}`,
                                "Next page": `http://localhost:4000/movies/search?title=${titleUrl}&p=${page + 1}`,
                                "Results": people.slice(page * 30 - 30, page * 30)
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
                                    res.json(listPeopleByGender)
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
                                        res.json(charsSortHeight)
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
                                        res.json(charsSortAge)
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