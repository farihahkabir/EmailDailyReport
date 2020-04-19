const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    personsName: {
        type: String,
        required: true
    },
    orderDay: {
        type: String,
        required: true
    },
    orderDate: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order',OrderSchema);
module.exports = Order;