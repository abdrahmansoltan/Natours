const Tour = require('../models/tourModel');

// Route Handlers
exports.getAllTours = async (req, res) => {
  try {
    // Build the Query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); // remove excluded fields from the cloned query object

    // Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // find on of these 4 words using regular expression and add "$" to it
    let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // using sort method from Mongoose
    } else {
      query = query.sort('-createdAt'); // by default sort tours ascendingly by creation-date
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); // include only these fields
    } else {
      query = query.select('-__v'); // exclude the "__v" property
    }

    // Pagination (page=2&limit=10)
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit; // "skip" is for the amount of results we skip before looking at data (all results that comes before the requested page)
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      // check if requested page doesn't exist
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("Page doesn't exist");
    }

    // Execute the Query
    const tours = await query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // to return back the updated tour rather than the original one
      runValidators: true, // to run the schema validators again
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
