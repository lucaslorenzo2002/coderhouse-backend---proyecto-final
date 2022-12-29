const mongoose = require('mongoose');
const Product  = require('../schemas/productModel');
const Cart  = require('../schemas/cartModel');

class productsCRUD{
    constructor(connection){
        this.connection = connection
    }

    async createProduct(prod){
        try{
            const data = await Product.create(prod);
            console.log('producto creado')
            console.log(data)            
        }catch(err){
            console.log(err)
        }
    } 

    async readAll(){
        try{
            const find = await Product.find();
            console.log('productos encontrados:', find)
            return find
        }catch(err){
            console.log(err)
        }
    }

    async readById(id){
        try{
            const findId = await Product.find({_id: id});
            console.log('producto encontrado:')
            return findId
        }catch(err){
            console.log(err)
        }
    }

    async update(id, key, newValue){
        try{
            const upd = await Product.updateOne({_id: id}, {key, newValue});
            console.log('producto actualizado con exito')
            return upd
        }catch(err){
            console.log(err)
        }
    }

    async deleteOne(id){
        try{
            const del = await Product.deleteOne({_id: id});
            console.log('producto eliminado con exito')
            return del
        }catch(err){
            console.log(err)
        }
    }
}

class cartsCRUD{
    constructor(model){
        this.model = model
    }

    async create(cart){
        try{
            const data = await Cart.create(cart);
            console.log('carrito creado', data._id)
        }catch(err){
            console.log(err)
        }
    }
    
    async readAll(){
        try{
            const find = await Cart.find();
            console.log('carritos encontrados:', find)
        }catch(err){
            console.log(err)
        }
    }
    
    async readById(id){
        try{
            const findId = await this.model.findOne({_id: id});
            console.log('carrito encontrado:', findId) 
        }catch(err){
            console.log(err)
        }
    }
    
    async postProdIntoCart(id, prodId){
        try{
            const prodFound = await Product.findOne({_id: prodId})
            await Cart.updateOne({_id: id}, {$push: {productos: prodFound}})
            console.log(`carrito ${id}, actualizado con exito`);
        }catch(err){
            console.log(err)
        }
    }
    
    async deleteOneProductFromCart(id, prodId){
        try{
            const prodFound = await Product.findOne({_id: prodId})
            await Cart.updateOne({_id: id}, {$pull: {productos: prodFound}})
            console.log(`producto eliminado correctamente del carrito ${id}`);
        }catch(err){
            console.log(err)
        }
    }
    
    async deleteOneCart(id){
        try{
            const del = await Cart.deleteOne({_id: id});
            console.log('carrito eliminado con exito')
            return del
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = {
    productsCRUD,
    cartsCRUD
}