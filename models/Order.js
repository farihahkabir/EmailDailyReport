const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order',OrderSchema);
module.exports = Order;