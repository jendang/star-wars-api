module.exports = function paginate(page, records, limit){
    //let pageCount = Math.ceil(records.length/limit) 
    return records.slice(limit * (page - 1), limit * page)
    
    // if(page <= pageCount){
    // } 
    // else {
    //    //return []
    //    //page = pageCount
    //    return records.slice(limit * (page - 1), limit * page)
    // }
}