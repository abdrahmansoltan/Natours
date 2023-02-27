const express = require('express');
const tourController = require('../controllers/tourController');

// Routes
const router = express.Router();

// chaining HTTP methods for the same route
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
