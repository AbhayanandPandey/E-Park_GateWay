const mongoose = require("mongoose");
const { DB_URL } = require("../config/env");
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.log('Failed to connect to MongoDB, retrying in 5 seconds...', err);
  setTimeout(connectWithRetry, 5000);
}); 