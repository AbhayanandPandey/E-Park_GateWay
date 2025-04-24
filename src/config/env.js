const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || "mongodb+srv://eparkgateway:qsb3O2PbQzMUysvX@epark.vrqna2i.mongodb.net/NEWDATA?retryWrites=true&w=majority&appName=Epark",

};
