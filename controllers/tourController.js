const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
);

// ID-Param Middleware before hitting the routes
exports.checkID = (req, res, next, val) => {
  if (+val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
// tour-body Middleware before hitting the createTour controller
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

// Route Handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id == id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  ); // must be Async to prevent blocking the event loop
};
exports.updateTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};
exports.deleteTour = (req, res) => {
  // 204 -> no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
