class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = { ...this.queryString }
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj).replace(/b\(gte|gt|lte|lt)/b / g, match => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    }
    //sort
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createAt');
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const allFields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(allFields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 10
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    //paginate  
}