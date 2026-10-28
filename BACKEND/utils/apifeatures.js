
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search products by keyword
    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                }
            }
            : {};

        this.query = this.query.find(keyword);

        return this;
    }

    // Filter products
   
filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not product filters
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Convert gt, gte, lt, lte into MongoDB operators
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
}
     pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
        
     }
}

module.exports = ApiFeatures;
