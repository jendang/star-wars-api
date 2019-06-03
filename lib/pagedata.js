
module.exports = function pageData(limit, offset, count, pageQuery){
    const pageData = {}
    limit = limit > count ? count : limit
    offset = offset > count ? count : offset
    
    pageData["total_count"] = count
    pageData["page_count"] = Math.ceil(count / limit)
    pageData["page_size"] = Number(limit)
    pageData["page"] = Number(pageQuery)
       
    return pageData
};

