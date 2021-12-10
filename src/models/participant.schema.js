const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'user',
    required: [true, "A participant needs to have an user."],
    autopopulate: true
  },
  creationDate: {
    type: Date,
    required: [true, "A participant needs to have a creationDate."],
  }
});
ParticipantSchema.plugin(require('mongoose-autopopulate'));
module.exports = ParticipantSchema