const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((t) => t.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  // Save the updated tours array to the JSON file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    })
  );
};

const updateTour = (req, res) => {
  const tour = tours.find((t) => t.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: { ...tour, ...req.body },
    },
  });
};

const deleteTour = (req, res) => {
  const tour = tours.find((t) => t.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }
  res.send('Deleted');
  // Save the updated tours array to the JSON file
};

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
  };
