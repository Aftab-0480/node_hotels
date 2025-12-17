const express = require("express");
const app = express();
const db = require("./db");

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // data will ultimately store to req.body

app.get("/", function (req, res) {
  res.send("welcome to out Hotel");
});


// Import the router files
const personRoutes = require('./routes/personRoutes');
const MenuItemRoutes = require('./routes/MenuItemRoutes');
// Use the routers
app.use('/person', personRoutes);
app.use('/menu', MenuItemRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}`);
});
