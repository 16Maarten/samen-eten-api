const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define a schema for reviews
const ReviewSchema = new Schema({
    text:String,
    creationDate:{
        type: Date,
        required: [true, 'A creationDate is required.'],
    },

    rating: {
        type: Number,
        required: [true, 'A rating is required.'],
        validate: {
            validator: (rating) => {
                return Number.isInteger(rating) && 0 <= rating && rating <= 5;
            },
            message: 'A rating can only be 1, 2, 3, 4 or 5 stars.'
        }
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'A user needs to be attached to a review.']
        
    }
});

module.exports = ReviewSchema;