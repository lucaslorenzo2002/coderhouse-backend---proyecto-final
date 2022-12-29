const mongoose = require('mongoose');

const productsCollection = "productos";

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'porfavor escriba el nombre del productos'],
        unique: true    
    },
    precio: {
        type: Number,
        required: [true, 'porfavor agruege el precio del producto']
    }
}, {
    timestamps: true
})

const Product = mongoose.model(productsCollection, productSchema);
module.exports = Product