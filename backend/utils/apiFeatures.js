class ApiFeatures {
    
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){

        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        this.query = this.query.find({ ...keyword });

        return this;
    }

    filter(){
        const queryCopy = { ...this.queryStr };

        // removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];

        removeFields.forEach(field => delete queryCopy[field]);

        // advanced filter (gt, gte, lt, lte)
        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    };

    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * currentPage -1;
        this.query.limit(resPerPage).skip(skip);
        return this
    };

};

module.exports = ApiFeatures;