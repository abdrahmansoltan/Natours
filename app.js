const express = require('express');
const fs = require('fs');

const app = express();

// Middlewares
app.use(express.json()); // to have access to "body" of req

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

// "v1" for API version, which is useful if there's a new version in the future
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', function (req, res) {
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
});

app.patch('/api/v1/tours/:id', function (req, res) {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

app.delete('/api/v1/tours/:id', function (req, res) {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // 204 -> no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
