const User = require("../models/user.model")(); // note we need to call the model caching function
const Meal = require("../models/meal.model")(); // note we need to call the model caching function
const errors = require("../errors");

async function create(req, res) {
  const user = await User.findOne({ _id: req.body.user });
  if (!user) {
    res.status(400).end();
    throw errors.EntityNotFoundError(
      `User with name '${req.body.user}' not found`
    );
  }
  const participant = {
    creationDate: req.body.creationDate,
    user: user._id,
  };
  const meal = await Meal.findById(req.params.id);

  meal.participants.push(participant);
  await meal.save();

  res.status(201).end();
}

async function remove(req, res) {
    const user = await User.findOne({ _id: req.body.user });
    if (!user) {
      res.status(400).end();
      throw errors.EntityNotFoundError(
        `User with name '${req.body.user}' not found`
      );
    }
    const meal = await Meal.findById(req.params.id);
    for (let i = 0; i < meal.participants.length; i++) {
      if (meal.participants[i].user == req.body.user) {
        meal.participants.splice(i, 1)
      }
    }
    await Meal.findByIdAndUpdate(req.params.id, meal);
    res.status(201).end();
}

async function getAll(req, res) {
    const meal = await Meal.findById(req.params.id);
    res.status(201).send(meal.participants)
}

module.exports = { create, remove, getAll};