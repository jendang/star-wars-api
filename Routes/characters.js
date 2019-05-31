const { Router } = require('express')
const axios = require('axios')
const router = new Router()

const baseUrl = 'https://swapi.co/api/films/'

// Search movie by title => characters => filter "gender" => sort "height" OR "age"
router.get('/movies/search', (req, res) => {
    let { title, gender, sortHeight, sortAge } = req.query
    // console.log(title)
    // console.log(gender)
    // console.log(sortHeight)
    // console.log(sortAge)
    axios
        .get(baseUrl)
        .then(response => response.data)
        .then(data => {
            if(title === undefined){
                return res.status(400).send("Bad request!")
            }
            else {
                if(title !== ""){
                    const promisesMovies = Promise.all(data.results)
                        .then(movies => {
                            // data = [{movie1},{movie2},...]
                            const filterMovie = movies.filter(movie => {
                                const movieTitle = movie.title.toLowerCase()
                                const titleQuery = title.toLowerCase()
                                return movieTitle.includes(titleQuery)
                            })

                            if(filterMovie.length === 0){
                                return res.status(404).send("Movie not found!!")
                            }else {
                                return filterMovie[0]
                            }
                        })
                        .then(charactersByMovie => charactersByMovie.characters)
                        .then(characters => {
                                const promisesCharacter =  Promise.all(characters.map(character => {
                                    return axios.get(character)
                                                .then(response => response.data)    
                                }))    
                                return promisesCharacter
                        })
                        .then(results => {
                            //results is [{characterObj1},{characterObj2},...]
                            if(gender !== undefined){
                                let genderQueryValue = gender.toLowerCase()
                                if(genderQueryValue === ""){
                                    return res.status(400).send("Bad request!")
                                }else if(genderQueryValue !== 'male' && genderQueryValue !== 'female') {    
                                    return res.status(400).send("Bad request!")
                                } else {
                                    const genderFilter = results.filter(result => genderQueryValue === result.gender)       
                                    return genderFilter
                                } 
                            } else {
                                return res.json(results)
                            }
                        }) 
                        .then(charsByGender => {
                            if(sortHeight === undefined && sortAge === undefined){
                                return res.json(charsByGender)
                            }
                            else if (sortHeight !== undefined && sortAge === undefined){
                                let sortHeightQueryValue = sortHeight.toLowerCase()
                                if(sortHeightQueryValue === ""){
                                    return res.status(400).send("Bad request!")
                                } else if(sortHeightQueryValue !== 'asc' && sortHeightQueryValue !== 'desc') {    
                                    return res.status(400).send("Bad request!")
                                } else {
                                    const charsSortHeight = charsByGender.sort((a,b) => {
                                        if(sortHeightQueryValue === 'asc'){
                                            return Number(a.height) - Number(b.height)
                                        } else {
                                            return Number(b.height) - Number(a.height)
                                        }
                                    })
                                    return res.json(charsSortHeight)
                                }
                            }
                            else if (sortHeight === undefined && sortAge !== undefined){
                                let sortAgeQueryValue = sortAge.toLowerCase()
                                if(sortAgeQueryValue === ""){
                                    return res.status(400).send("Bad request!")
                                } else if(sortAgeQueryValue !== 'asc' && sortAgeQueryValue !== 'desc') {    
                                    return res.status(400).send("Bad request!")
                                } else {
                                    const charsSortAge = charsByGender.sort((a,b) => {
                                        if(sortAgeQueryValue === 'asc'){
                                            return parseInt(a.birth_year) - parseInt(b.birth_year)
                                        } else {
                                            return parseInt(b.birth_year) - parseInt(a.birth_year)
                                        }
                                    })
                                    return res.json(charsSortAge)
                                }
                            }
                            else if (sortHeight !== undefined && sortAge !== undefined){
                                return res.status(400).send("You can sort either height or age per time")
                            }
                            else {
                                return res.json(charsByGender)
                            }
                            
                        })
                        .catch(err => console.error(err)) 

                    return promisesMovies                 
                } else {
                    return res.status(400).json({ message: "It is bad request, you should enter the title"})
                }
            }
        })  
        .catch(err => console.error(err)) 
})


module.exports = router