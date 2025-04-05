const dotenv = require('dotenv');
dotenv.config();
module.exports = {  
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || "mongodb://pathofyourDB",
};
