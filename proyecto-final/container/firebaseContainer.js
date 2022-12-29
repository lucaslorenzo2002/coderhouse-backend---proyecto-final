const db = require('../config/firebasConfig');

class productsFBCRUD{
    constructor(collection){
        this.queryP = db.collection(collection)
    }

    async create(data){
        try {
            const doc = this.queryP.doc();
            await doc.create(data)
            console.log('producto agregado con exito');
        } catch (error) {
            console.log(error);
        }
    }

    async readAll(){
        try {
            const querySnapshot = await this.queryP.get();
            let docs = querySnapshot.docs;

            const response = docs.map((doc) => ({
                id: doc.id,
                nombre: doc.data().nombre,
                precio: doc.data().precio
            }))
            console.log('productos encontrados(firebase): ', response);
        } catch (error) {
            console.log(error);
        }
    }

    async readById(id){
        try {
            const doc = this.queryP.doc(id);
            const item = await doc.get();
            const response = item.data();
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    async update(id, newValue){
        try {
            const doc = this.queryP.doc(id);
            let item = await doc.update(newValue);
            console.log('el producto ha sido actualizado', item);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            const doc = this.queryP.doc(id);
            await doc.delete();
            console.log('el producto ha sido borrado');
        } catch (error) {
            console.log(error);
        }
    }
}

class cartsFBCRUD{
    constructor(collection){
        this.queryC = db.collection(collection)
    }

    async create(data){
        try {
            const doc = this.queryC.doc();
            await doc.create(data)
            console.log('carrito creado');
        } catch (error) {
            console.log(error);
        }
    }

    async readAll(){
        try {
            const querySnapshot = await this.queryC.get();
            let docs = querySnapshot.docs;

            const response = docs.map((doc) => ({
                id: doc.id,
                nombre: doc.data().nombre,
                precio: doc.data().precio
            }))
            console.log('productos encontrados(firebase): ', response);
        } catch (error) {
            console.log(error);
        }
    }

    async readById(id){
        try {
            const doc = this.queryC.doc(id);
            const item = await doc.get();
            const response = item.data();
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    async postProdIntoCart(id, prodId){
        try {
            const doc = this.queryC.doc(id);
            await doc.update();
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProductsFromCart(){
        try {
            
        } catch (error) {
            
        }
    }

    async deleteOneCart(id){
        try {
            const doc = this.queryC.doc(id);
            await doc.delete();
            console.log('el carrito ha sido borrado');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    productsFBCRUD,
    cartsFBCRUD
}