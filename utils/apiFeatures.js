class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Build the Query
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); // remove excluded fields from the cloned query object

    // Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // find on of these 4 words using regular expression and add "$" to it

    this.query = this.query.find(JSON.parse(queryStr));
    return this; // to be able to chain methods
  }

  sort() {
    // Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // using sort method from Mongoose
    } else {
      this.query = this.query.sort('-createdAt'); // by default sort tours ascendingly by creation-date
    }
    return this;
  }

  limitFields() {
    // Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); // include only these fields
    } else {
      this.query = this.query.select('-__v'); // exclude the "__v" property
    }
    return this;
  }

  paginate() {
    // Pagination (page=2&limit=10)
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit; // "skip" is for the amount of results we skip before looking at data (all results that comes before the requested page)
    this.query = this.query.skip(skip).limit(limit);
    // if (this.queryString.page) {
    //   // check if requested page doesn't exist
    //   const numTours = await this.query.countDocuments();
    //   if (skip >= numTours) throw new Error("Page doesn't exist");
    // }
    return this;
  }
}

module.exports = APIFeatures;
