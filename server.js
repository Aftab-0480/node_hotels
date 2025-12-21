const express = require("express");
const app = express();
const db = require("./db");
require('dotenv').config();
const passport = require('./auth'); // import the auth file named as passport to use in server.js
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // data will ultimately store to req.body
const PORT = process.env.PORT || 3003;

//Middleware Function
const logRequest = (req, res, next)=> {
  console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
  next(); // Move on to the next phase
}

app.use(logRequest);
app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local', {session: false});

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
