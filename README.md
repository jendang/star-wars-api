
# STAR WARS Fanclub Website 

This is the backend for STAR WARS fanclub website make calls to the various API endpoints. 

## Table of contents

* Requirements
* Framework/technologies 
* Installation 
* Usage
* Features
* APIs/Packages references

## Requirements

* Node.js (used v12.1.0 for this project)

## Framework

* [Express] (https://expressjs.com/)

## Installation

* First, clone the project https://github.com/jendang/star-wars-api.git

```
cd projectFolder  

npm install

```

* To start the server, for more information/download nodemon [here](https://nodemon.io/)

```

node .

// or I recommended use Nodemon

nodemon .

```

## Usage

Current methods are:

1. Searching all movies series of STAR WARS .get("/movies"), it will return an array of object movies. 

Here is an example data of a movie object. 

```
{
    title	"A New Hope"
    episode_id	4
    opening_crawl	"It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy...."
    director	"George Lucas"
    producer	"Gary Kurtz, Rick McCallum"
    release_date	"1977-05-25"
    characters	[…]
    planets	[…]
    starships	[…]
    vehicles	[…]
    species	[…]
    created	"2014-12-10T14:23:31.880000Z"
    edited	"2015-04-11T09:46:52.774897Z"
    url	"https://swapi.co/api/films/1/"
}

```

The characters property is an array of url's characters

```
{
    title	"A New Hope"
    ....
    ....
    characters	
        0	"https://swapi.co/api/people/1/"
        1	"https://swapi.co/api/people/2/"
        2	"https://swapi.co/api/people/3/"
        3	"https://swapi.co/api/people/4/"
        4	"https://swapi.co/api/people/5/"
        5	"https://swapi.co/api/people/6/"
        6	"https://swapi.co/api/people/7/"
        7	"https://swapi.co/api/people/8/"
        8	"https://swapi.co/api/people/9/"
        9	"https://swapi.co/api/people/10/"
        10	"https://swapi.co/api/people/12/"
        11	"https://swapi.co/api/people/13/"
        12	"https://swapi.co/api/people/14/"
        13	"https://swapi.co/api/people/15/"
        14	"https://swapi.co/api/people/16/"
        15	"https://swapi.co/api/people/18/"
        16	"https://swapi.co/api/people/19/"
        17	"https://swapi.co/api/people/81/"
    planets	[…]
    starships	[…]
    vehicles	[…]
    species	[…]
    created	"2014-12-10T14:23:31.880000Z"
    edited	"2015-04-11T09:46:52.774897Z"
    url	"https://swapi.co/api/films/1/"
}


```

2. Searching a specific movie and return a list of characters from that movie. The pagination is done of the batches of 30 (default limit = 30) .get("/movies/search?title=")

There are available some options for query parameters after we fetching all characters:

* gender: filter all characters by gender (female, male)

```
http://localhost:4000/movies/search?title=hope&gender=male

http://localhost:4000/movies/search?title=hope&gender=female

```

* sorting either height or age of characters by ascending/descending order

```
http://localhost:4000/movies/search?title=hope&gender=male&sortHeight=asc

http://localhost:4000/movies/search?title=hope&gender=female&sortAge=desc


```

* Pagination: the limit is default of 30 characters per page. However it is dynamic, you can set limit higher or lower with the query paramater (&limit=). If the length of data is more than 30, you can use query parameter (&page=[next page]) to get the rest of data.

Here is an example of data of method .get("/movies/search?title=new+hope")

```
Movie: 	"A New Hope"
Page data: 	
    Total Count	18
    Page Count	1
    Page Size	18
    Page	1
Characters: 	
    0	{…}
    1	{…}
    2	{…}
    3	{…}
    4	{…}
    5	{…}
    6	{…}
    7	{…}
    8	{…}
    9	{…}
    10	{…}
    11	{…}
    12	{…}
    13	{…}
    14	{…}
    15	{…}
    16	{…}
    17	{…}

```

Here is an example of a character object (detailed information of a character):

```
{
    name	"Luke Skywalker"
    height	"172"
    mass	"77"
    hair_color	"blond"
    skin_color	"fair"
    eye_color	"blue"
    birth_year	"19BBY"
    gender	"male"
    homeworld	"https://swapi.co/api/planets/1/"
    films	
    0	"https://swapi.co/api/films/2/"
    1	"https://swapi.co/api/films/6/"
    2	"https://swapi.co/api/films/3/"
    3	"https://swapi.co/api/films/1/"
    4	"https://swapi.co/api/films/7/"
    species	
    0	"https://swapi.co/api/species/1/"
    vehicles	
    0	"https://swapi.co/api/vehicles/14/"
    1	"https://swapi.co/api/vehicles/30/"
    starships	
    0	"https://swapi.co/api/starships/12/"
    1	"https://swapi.co/api/starships/22/"
    created	"2014-12-09T13:50:51.644000Z"
    edited	"2014-12-20T21:17:56.891000Z"
    url	"https://swapi.co/api/people/1/"
}

```

3. This endpoint .get("/planets/search?climate=") will return an object of all the planets that have this climate-type, and a collection of all dark-haired characters that live on this planet. The pagination works the same as the characters above.

```
http://localhost:4000/planets/search?climate=arid

```

Might return this json data, if the planet does not have any darkHaired characters, the darkHairedPeople property will return an empty array.

```

// Object of all planets

{
    Page data 	
        Total Count	9
        Page Count	1
        Page Size	9
        Page	1
    Planets:
        0   name	"Tatooine"
            rotation_period	"23"
            orbital_period	"304"
            diameter	"10465"
            climate	"arid"
            gravity	"1 standard"
            terrain	"desert"
            surface_water	"1"
            population	"200000"
            residents	[…]
            films	[…]
            created	"2014-12-09T13:50:49.641000Z"
            edited	"2014-12-21T20:48:04.175778Z"
            url	"https://swapi.co/api/planets/1/"
            darkHairedPeople	
                        0	{…}
                        1	{…}
                        2	{…}
                        3	{…}
                        1	{…}
                        2	{…}
                        3	{…}
                        4	{…}
                        5	{…}
                        6	{…}
                        7	{…}
                        8	{…}

        1   {}
        2   {}
        ...
        ...

}

```

## Features

- Building database with Postgres
- Building more endpoints APIs such as searching specific character by name, homeworld ...
- Front-end implementing
  


## APIs references

All data was fetching from [SWAPI](https://swapi.co/).
