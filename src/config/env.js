const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || "mongodb+srv://resumecrafthub:v4Fa7YjlEumXLeKe@blinkit.7v48nmp.mongodb.net/Blinlkyt?retryWrites=true&w=majority", 

};   
