"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIFeatures = void 0;
class APIFeatures {
    constructor(originalQuery, requestQuery) {
        this.query = originalQuery;
        this.requestQuery = requestQuery;
    }
    _search() {
        if (this.requestQuery.search) {
            const searchField = this.requestQuery.searchField || 'name';
            this.query = this.query.find({
                [searchField]: {
                    $regex: new RegExp(decodeURI(this.requestQuery.search), 'i'),
                },
            });
        }
        return this;
    }
    _filter() {
        const cloneRequestQuery = Object.assign({}, this.requestQuery);
        ['page', 'sort', 'limit', 'fields', 'search'].forEach((field) => delete cloneRequestQuery[field]);
        let stringRequestQuery = JSON.stringify(cloneRequestQuery);
        stringRequestQuery = stringRequestQuery.replace(/\b(gte|lte|gt|lt|ne)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(stringRequestQuery));
        return this;
    }
    _sort() {
        if (this.requestQuery.sort) {
            const sortBy = this.requestQuery.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    _fields() {
        if (this.requestQuery.fields) {
            const fields = this.requestQuery.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    _paginate() {
        const page = this.requestQuery.page * 1 || 1;
        const limit = this.requestQuery.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.APIFeatures = APIFeatures;
//# sourceMappingURL=APIFeatures.js.map