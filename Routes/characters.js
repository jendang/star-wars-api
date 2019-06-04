const { Router } = require("express")
const axios = require("axios")
const router = new Router()
const pageData = require("../lib/pagedata")
const paginate = require("../lib/pagination")

async function fetchAllMovies() {
    const baseUrl = "https://swapi.co/api/films/"
    const response = await axios.get(`${baseUrl}`)
    return response.data.results
}

//show all of Star Wars films details
router.get("/movies", (req, res) => {
    return fetchAllMovies()
}) 

// Search movie by title => characters => filter "gender" => sort "height" OR "age"
router.get("/movies/search", (req, res) => {
    let { title, gender } = req.query

    let limit = req.query.limit || 30
    let offset = req.query.offset || 0
    let page = req.query.page || 1

    //Validate query params "title"
    if(title === undefined){
        return res.status(400).send({ message: "Bad request! Please input title query"})
    } 
    if(title === ""){
        return res.status(400).send({ message: "Title search term should not be empty!"})
    } 

    const result =  fetchAllMovies()
        .then(movies => {
            //console.log(movies) 
            const titleQuery = title.toLowerCase()
            const movie =  movies.find(movie => {
                const movieTitle = movie.title.toLowerCase()
                if(movieTitle.includes(titleQuery)){
                    return movie 
                }
            })
            if(movie === undefined){
                return res.status(404).send({ message: `Not found any movie with ${titleQuery} title `})
            } 
            const movieTitle = movie.title
            let sortHeight = req.query.sortHeight
            let sortAge = req.query.sortAge
    
            const charactersPromises =  movie.characters.map(url => axios.get(url))
            return Promise.all(charactersPromises)
                .then(responses => responses.map(response => response.data))
                .then(characters => {
                    const pageDataCharacters = pageData(limit, offset, characters.length, page)
    
                    // Validate query params "gender"
                    if(gender === undefined){         
                        if(parseInt(page) > pageDataCharacters.page_count){
                            return res.status(404).send({ message: "Invalid page!" })
                        }
                        return res.json({
                            movie: movieTitle,
                            pageData: pageDataCharacters, 
                            characters: paginate(parseInt(page), characters, limit)
                        })     
                    } 
                    
                    if(gender.toLowerCase() !== "male" && gender.toLowerCase() !== "female" ){
                        return res.status(400).send({ message: `Gender query's value is either "male" or "female"!`})
                    }

                    // Validate query params "sortHeight" & "sortAge"
                    
                    const charactersByGender = characters.filter(character => character.gender === gender.toLowerCase())
    
                    const pageDataByGender = pageData(limit, offset, charactersByGender.length, page)
                    if(parseInt(page) > pageDataByGender.page_count){
                        return res.status(404).send({ message: "Invalid page!" })
                    }
                       
                    // Validate query params "sortHeight" & "sortAge"
                    if(sortHeight === undefined && sortAge === undefined){
                        return res.json({
                            movie: movieTitle,
                            pageData: pageDataByGender, 
                            characters: paginate(parseInt(page), charactersByGender, limit)
                        })
                    }
    
                    if (sortHeight !== undefined && sortAge !== undefined){
                        return res.status(400).send({ message: "You can sort either height or age per time"})
                    }
    
                    if(sortHeight !== undefined && sortAge === undefined){
                        if(sortHeight.toLowerCase() !== "asc" && sortHeight.toLowerCase() !== "desc") {    
                            return res.status(400).send({ 
                                message: `Height can be sorted "asc" - ascending or "desc" - descending!`
                            })
                        } 
                        const charsSortHeight = charactersByGender.sort((a,b) => {
                            if(sortHeight.toLowerCase() === "asc"){
                                return parseInt(a.height) - parseInt(b.height)
                            } else {
                                return parseInt(b.height) - parseInt(a.height)
                            }
                        })
                        
                        return res.json({
                            movie: movieTitle,
                            paginate: pageDataByGender, 
                            characters: paginate(parseInt(page), charsSortHeight, limit)
                        })
                    }
    
                    if(sortHeight === undefined && sortAge !== undefined){
                        if(sortAge.toLowerCase() !== "asc" && sortAge.toLowerCase() !== "desc") {    
                            return res.status(400).send({ message: `Age can be sorted "asc" - ascending or "desc" - descending!`})
                        }
                        const charsSortAge = charactersByGender.sort((a,b) => {
                            if(sortAge.toLowerCase() === "asc"){
                                return parseInt(a.birth_year) - parseInt(b.birth_year)
                            } else {
                                return parseInt(b.birth_year) - parseInt(a.birth_year)
                            }
                        })
    
                        return res.json({
                            movie: movieTitle,
                            pageData: pageDataByGender, 
                            characters: paginate(parseInt(page), charsSortAge, limit)
                        })
                    }
                })
                .catch(err => console.error(err))
            // })



        })
        // .then(movie => {
        .catch(err => console.error(err))        

    return result
})

module.exports = router