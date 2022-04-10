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

app.use(cors())

app.use(helmet())

app.use("/api/users", user);

app.use("/api/meals", meal)

app.use("/api/studenthomes", studenthome)

app.use("/api/meals", participant)

app.use("/api/meals", review)


app.use('*', function(_, res) {
  res.status(404).end()
})

app.use('*', function(err, req, res, next) {
  console.error(`${err.name}: ${err.message}`)
  next(err)
})

app.use('*', errors.handlers)

app.use('*', function(err, req, res, next) {
  res.status(500).json({
      message: 'something really unexpected happened'
  })
})

module.exports = app
