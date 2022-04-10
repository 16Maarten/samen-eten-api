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
  const review = {
    rating: req.body.rating,
    text: req.body.text,
    creationDate: req.body.creationDate,
    user: user._id,
  };
  let meal = await Meal.findById(req.params.id);
  meal.reviews.push(review);
  await meal.save();
  res.status(201).send({message: "Review added!", id: meal.reviews[(meal.reviews.length)-1]._id}).end();
}

async function update(req, res) {
  let send = false
  const meal = await Meal.findById(req.params.id);
  for (let i = 0; i < meal.reviews.length; i++) {
    if (meal.reviews[i]._id == req.params.idReview) {
      meal.reviews[i].rating = req.body.rating;
      meal.reviews[i].text = req.body.text;
      await Meal.findByIdAndUpdate(req.params.id, meal);
      send = true
      res.status(201).send( meal.reviews[i]).end();
    }
  }
  if(!send){
    res.status(400).send({ message: "Invalid resource id: "+ req.params.idReview }).end();
    }
}

async function remove(req, res) {
  let send = false
    const meal = await Meal.findById(req.params.id);
    for (let i = 0; i < meal.reviews.length; i++) {
      if (meal.reviews[i]._id == req.params.idReview) {
        await Meal.findByIdAndUpdate(req.params.id, meal);
        send = true
        res.status(201).send({message: "entity with id: " + req.params.idReview + " deleted"}).end();
      }
    }
    if(!send){
      res.status(400).send({ message: "Invalid resource id: "+ req.params.idReview }).end();
      }
}

async function get(req, res) {
    let send = false
    const meal = await Meal.findById(req.params.id);
    for (let i = 0; i < meal.reviews.length; i++) {
      if (meal.reviews[i]._id == req.params.idReview) {
        send = true
        res.status(201).send(meal.reviews[i])
      }
    }
    if(!send){
    res.status(400).send({ message: "Invalid resource id: "+ req.params.idReview }).end();
    }
}

async function getAll(req, res) {
    const meal = await Meal.findById(req.params.id);
    res.status(201).send(meal.reviews)
}

module.exports = { create, update, remove, get, getAll};
