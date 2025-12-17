const express = require("express");
const app = express();
const db = require("./db");
require('dotenv').config();

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // data will ultimately store to req.body
const PORT = process.env.PORT || 3003;

app.get("/", function (req, res) {
  res.send("welcome to out Hotel");
});


// Import the router files
const personRoutes = require('./routes/personRoutes');
const MenuItemRoutes = require('./routes/MenuItemRoutes');
// Use the routers
app.use('/person', personRoutes);
app.use('/menu', MenuItemRoutes);

app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}`);
});
