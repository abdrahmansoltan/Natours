const dotenv = require('dotenv');
// specify the path of configuration file
dotenv.config({ path: './config.env' }); // MUST BE BEFORE requiring app file

const app = require('./app');

// Start Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
