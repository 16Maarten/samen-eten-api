const express = require("express")
require('express-async-errors')
const cors = require('cors')
const helmet = require('helmet')
const errors = require('./errors')
const logger = require("tracer").colorConsole();
const user = require("./routes/user.routes");
const studenthome = require("./routes/studenthome.routes");
const meal = require("./routes/meal.routes");
const participant = require("./routes/participant.routes");
const review = require("./routes/review.routes");

const app = express();
app.use(express.json())
// enable CORS (cross origin resourse sharing)
// you don't need it for this example, but you will if you host a frontend
// on a different origin (url)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors())

// not the topic of this example, but good to be aware of security issues
// helmet sets headers to avoid common security risks
// https://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet())

// Authenticatie | UC-101 t/m UC-103
app.use("/api/users", user);
// Meals | UC-301 t/m UC-305
app.use("/api/meals", meal)
// Studenthome | UC-201 t/m UC-206
app.use("/api/studenthomes", studenthome)
// Participant | UC-401 t/m UC-404
app.use("/api/meals", participant)

app.use("/api/meals", review)

// catch all not found response
app.use('*', function(_, res) {
  res.status(404).end()
})

// error responses
app.use('*', function(err, req, res, next) {
  console.error(`${err.name}: ${err.message}`)
  // console.error(err)
  next(err)
})

app.use('*', errors.handlers)

app.use('*', function(err, req, res, next) {
  res.status(500).json({
      message: 'something really unexpected happened'
  })
})

module.exports = app
