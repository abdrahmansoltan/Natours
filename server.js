const dotenv = require('dotenv');
const mongoose = require('mongoose');
// specify the path of configuration file
dotenv.config({ path: './config.env' }); // MUST BE BEFORE requiring app file

const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log(err));

// Start Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
