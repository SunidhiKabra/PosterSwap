var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    userId: Schema.Types.ObjectId,
    userFirstName: {
        type: String,
        required: 'Kindly enter the first name'
    },
    userLastName: {
        type: String,
        required: 'Kindly enter the last name'
    },
    userEmail: {
        type: String,
        required: 'Kindly enter the email'
    },
    userPassword: {
        type: String,
        required: 'Kindly enter the password'
    },
    userAddress1: String,
    userAddress2: String,
    userCity: String,
    userState: String,
    userCountry: String,
    userItems: [{
      itemCode: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
      }
    }
    ]
,
    userRating: String
}, {collection: 'User'});

module.exports = mongoose.model('User', UserSchema);
