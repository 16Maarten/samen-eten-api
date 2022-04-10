const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const getModel = require("./model_cache");

const StudenthomeSchema = new Schema({
  // a user needs to have a name
  name: {
    type: String,
    required: [true, "A studenthome needs to have a name."],
    unique: [true, "Name has to be unique"],
  },
  streetName: {
    type: String,
    required: [true, "A studenthome needs to be located at a street."],
  },
  houseNumber: {
    type: Number,
    required: [true, "A studenthome needs to be located at a housenumber."],
  },
  postalCode: {
    type: String,
    required: [true, "A studenthome needs to have a postalcode"],
    validate: [validatePostalCode, "Invalid postalCode"],
  },
  residence: {
    type: String,
    required: [true, "A studenthome needs to be located in a residence"],
  },
  phoneNumber: {
    type: String,
    required: [true, "A studenthome needs to have a phonenumber"],
    validate: [validatePhoneNumber, "Invalid phoneNumber"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "A studenthome needs to have a owner."],
  },
});
const validatePostalCodeScript = /^(?:NL-)?(\d{4})\s*([A-Z]{2})$/i;

const validatePhoneNumberScript =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

function validatePostalCode(val) {
  return validatePostalCodeScript.test(val);
}

function validatePhoneNumber(val) {
  return validatePhoneNumberScript.test(val);
}

StudenthomeSchema.pre("remove", function (next) {
  const Meal = mongoose.model("meal");
  Meal.deleteMany({studenthome: this._id }).then(() => next());
});

StudenthomeSchema.plugin(uniqueValidator);
module.exports = getModel("studenthome", StudenthomeSchema);
