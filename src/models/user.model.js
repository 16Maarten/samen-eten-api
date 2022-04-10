const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getModel = require("./model_cache");
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "An user needs to have a firstName."],
  },
  lastName: {
    type: String,
    required: [true, "An user needs to have a lastName."],
  },
  studentNumber: {
    type: Number,
    required: [true, "An user needs to have a studentNumber."],
    validate: {
        validator: (studentNumber) => {
            return Number.isInteger(studentNumber) && studentNumber >= 100000;
        },
        message: 'A studentNumber has to be higher then 100000'
    },
    unique: [true, "StudentNumber has to be unique"],
  },
  birthday: {
    type: Date,
    required: [true, "An user needs to have a studentNumber."]
  },
  email: {
    type: String,
    required: [true, "An user needs to have an email."],
    validate: [validateEmail, "Invalid email"],
    unique: [true, "Email has to be unique"],
  },
  password: {
    type: String,
    required: [true, "An user needs to have a password."],
  },
});
const validateEmailScript = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


function validateEmail(val) {
  return validateEmailScript.test(val);
}

UserSchema.pre('remove', function (next) {
    const Meal = mongoose.model('meal')
    Meal.deleteMany({ 'organizer': this._id }).then(() => next())
    Meal.updateMany({}, { $pull: { 'reviews': { 'user': this._id } } }).then(() => next())
})

UserSchema.plugin(uniqueValidator);

module.exports = getModel("user", UserSchema);