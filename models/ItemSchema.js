var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ItemSchema = new Schema({
    itemCode: Schema.Types.ObjectId,
    itemName: {
        type: String,
        required: 'Kindly enter the item name'
    },
    itemCategory:{
        type: String,
        required: 'Kindly enter the category name'
    },
    itemDescription: String,
    itemRating: String,
    itemImageUrl: String,
    itemStatus: {
        type: String,
        default: 'available'
    },
    itemSwapItem: String,
    itemSwapItemRating: String,
    itemSwapperRating: String
}, {collection: 'Item'});

module.exports = mongoose.model('Item', ItemSchema);
