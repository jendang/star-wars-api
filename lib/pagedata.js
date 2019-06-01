
module.exports = function pageData(limit, offset, count, pageQuery){
    const pageData = {}
    limit = limit > count ? count : limit
    offset = offset > count ? count : offset
  
    pageData["Total Count"] = count
    pageData["Page Count"] = Math.ceil(count / limit)
    pageData["Page Size"] = Number(limit)
    pageData["Page"] = pageQuery
    return pageData
};

