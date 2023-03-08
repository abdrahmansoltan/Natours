// Wrapper error handling function
const catchAsync = (fn) => {
  // return anonymous function which will be assigned to the route-handler-function
  return (req, res, next) => {
    fn(req, res, next).catch((error) => next(error)); // fn returns a promise, we we can catch errors from it
  };
};

module.exports = catchAsync;
