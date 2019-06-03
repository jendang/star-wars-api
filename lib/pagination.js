module.exports = function paginate(page, records, limit){
    return records.slice(limit * (page - 1), limit * page)
}