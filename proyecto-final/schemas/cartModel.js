const mongoose = require('mongoose');

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    productos: [{nombre: String, precio: Number}]
}, {
    timestamps: true
})

const Cart = mongoose.model(cartCollection, cartSchema);
module.exports = Cart