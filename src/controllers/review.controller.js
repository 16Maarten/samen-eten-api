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

  const meal = await Meal.findById(req.params.id);

  // maybe not necessary any more now that we store it in neo?
  // BEWARE: atomicity issues!
  meal.reviews.push(review);
  await meal.save();

  /*const session = neo.session()

    await session.run(neo.review, {
        userId: user._id.toString(),
        productId: product._id.toString(),
        rating: review.rating,
    })*/

  res.status(201).end();
}

async function update(req, res) {
  const meal = await Meal.findById(req.params.id);
  for (let i = 0; i < meal.reviews.length; i++) {
    if (meal.reviews[i]._id == req.params.idReview) {
      meal.reviews[i].rating = req.body.rating;
      meal.reviews[i].text = req.body.text;
    }
  }
  await Meal.findByIdAndUpdate(req.params.id, meal);
  res.status(201).end();
}

async function remove(req, res) {
    const meal = await Meal.findById(req.params.id);
    for (let i = 0; i < meal.reviews.length; i++) {
      if (meal.reviews[i]._id == req.params.idReview) {
        meal.reviews.splice(i, 1)
      }
    }
    await Meal.findByIdAndUpdate(req.params.id, meal);
    res.status(201).end();
}

async function get(req, res) {
    const meal = await Meal.findById(req.params.id);
    for (let i = 0; i < meal.reviews.length; i++) {
      if (meal.reviews[i]._id == req.params.idReview) {
        res.status(201).send(meal.reviews[i])
      }
    }
}

async function getAll(req, res) {
    const meal = await Meal.findById(req.params.id);
    res.status(201).send(meal.reviews)
}

module.exports = { create, update, remove, get, getAll};
