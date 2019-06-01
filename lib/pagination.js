module.exports = function paginate(page, records, limit){
    let pageCount = Math.ceil(records.length/limit) 
    if(page <= pageCount){
        return records.slice(limit * (page - 1), limit * page)
    } else {
       return null
    }
}