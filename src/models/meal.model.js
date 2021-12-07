const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ParticipantSchema = require('./participant.schema');
const ReviewSchema = require('./review.schema');

const getModel = require("./model_cache");

const MealSchema = new Schema({
  studenthome: {
    type: Schema.Types.ObjectId,
    ref:'studenthome',
    required: [true, "A meal needs to have a studenthome."],
    autopopulate: true
  },
  name: {
    type: String,
    required: [true, "A meal needs to have a name."],
  },
  creationDate: {
    type: Date,
    required: [true, "A meal needs a creationDate"],
  },
  offerdOn: {
    type: Date,
    required: [true, "A meal needs an offerdOn "],
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref:'user',
    required: [true, "A meal needs to have an organizer."],
    autopopulate: true
  },
  price: {
    type: Number,
    required: [true, "A meal needs to have a price"],
    validate: {
        validator: (price) => {
            return Number.isInteger(price) && price >= 0;
        },
        message: 'A price is minimal 0'
    }
  },
  allergies: {
    type: String
  },
  ingredients: {
    type: [String],
    required: [true, "A meal needs to have ingredients."],
  },
  participants:{
      type: [ParticipantSchema]
  },
  reviews:{
    type: [ReviewSchema],
    autopopulate: true
}

});

// export the user model through a caching function
module.exports = getModel("meal", MealSchema);