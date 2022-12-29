const express = require('express');
const fs = require('fs')
const { json } = require('express');
const{ Router } = express;

const app = express();
const router = new Router();

const exphbs = require('express-handlebars');
const path = require('path');

//REQUIRE A CLASES DE FIRESTORE
const { productsFBCRUD } = require('./container/firebaseContainer');
const { cartsFBCRUD } = require('./container/firebaseContainer');

//CONTENEDOR DE FIRESTORE
const prodsContainerFB = new productsFBCRUD('products');
const cartsContainerFB = new cartsFBCRUD('carts');

const connection = require('./config/mongoConfig')
.then(() => console.log('mongoose conectado'))
.catch((err) => console.log(err))

//REQUIRE A CLASES DE MONGOOSE
const { productsCRUD } = require('./container/mongoContainer');
const { cartsCRUD } = require('./container/mongoContainer');

//CONTENEDOR DE MONGOOSE
const prodsContainer = new productsCRUD(connection);
const cartsContainer = new cartsCRUD(connection);

//CONEXION A HANDLEBARS
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//CONEXION AL PUERTO
const PORT = 8080

const server = app.listen(process.env.PORT || PORT, () => {
    console.log(` server listening on PORT: ${PORT}`)
})

server.on('error', err => console.log(err))


//MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/api', router)

//FUNCIONES DE FS
const { writeFile } = require('./container/fsContainer')
const { getAll } = require('./container/fsContainer')

//RUTAS
const RUTA_PRODUCTOS = '/productos';
const RUTA_PRODUCTOS_ID = '/productos/:id';
const RUTA_CARRITO = '/carrito';
const RUTA_CARRITO_ID = '/carrito/:id';

//MIDDLEWARES DE ERROR
let administrador = false

const notAnAdmin = (req, res, next) => {
    if(administrador = false){
        res.status(404).json({error: 'necesitas ser administrador para acceder a esta funcion'})
    } else{
        next()
    }
}

const productNotFound = (req, res, next) => {
    if(parseInt(req.params.id) > products.length || parseInt(req.params.id) <= 0){
        res.status(404).json({error: 'product not found'})
    } else{
        next()
    }
}

const cartNotFound = (req, res, next) => {
    if(parseInt(req.params.id) > carts.length || parseInt(req.params.id) <= 0){
        res.status(404).json({error: 'cart not found'})
    } else{
        next()
    }
}

//RUTAS DE PRODUCTOS
let products = [];

//POST

router.post(RUTA_PRODUCTOS, notAnAdmin, (req, res) => {
    const newId = products.length + 1;
    const newProduct = {id: newId, ...req.body};
    products.push(newProduct)
    prodsContainer.createProduct(newProduct)
    prodsContainerFB.create(newProduct)
    writeFile(products, 'productos.txt')
    res.send(`producto agregado - id: ${newId}`)
})

//GET

router.get(RUTA_PRODUCTOS_ID, productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const productFound = products.find(prod => prod.id === id);
    prodsContainer.readById(idStr)
    prodsContainerFB.readById(idStr)
    getAll('productos.txt')
    res.json(productFound)
})

router.get(RUTA_PRODUCTOS, (req, res) => {
    prodsContainer.readAll()
    prodsContainerFB.readAll()
    res.json(products)
})

//PUT

router.put(RUTA_PRODUCTOS_ID, notAnAdmin, productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const newData = req.body
    products = products.map(p => p.id === id ? {...p, ...newData} : p);
    prodsContainer.update(idStr, newData)
    prodsContainerFB.update(idStr, newData)
    res.json({estado: 'producto actualizado con exito'})
})

//DELETE

router.delete(RUTA_PRODUCTOS_ID, notAnAdmin, productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    let deleteProductFound = products.filter(p => p.id !== id);
    prodsContainer.deleteOne(idStr)
    prodsContainerFB.deleteById(idStr)
    res.json(deleteProductFound)
})

//RUTAS DE CARRITOS

let carts = []

//POST

router.post(RUTA_CARRITO, (req, res) => {
    const newId = carts.length + 1;
    const timestamp = Date.now()
    let newCart = {
        id: newId, 
        timestamp: timestamp,
        products: []
    };
    carts.push(newCart)
    writeFile(carts, 'carts.txt')
    cartsContainer.create(newCart)
    cartsContainerFB.create(newCart)
    res.send(`carrito agregado - id:${newId}`)
})

router.post('/carrito/:id/productos/:id_prod', cartNotFound, (req, res) => {
    const cartId = parseInt(req.params.id);
    const cartIdStr = req.params.id
    const prodId = parseInt(req.params.id_prod);
    const prodIdStr = req.params.id_prod;
    const productFound = products.find(prod => prod.id === prodId);
    const cartFound = carts.find(cart => cart.id === cartId);
    cartFound.products.push(productFound)

    cartsContainer.postProdIntoCart(cartIdStr, prodIdStr)
    res.send(`producto - id: ${prodId} agregado al carrito - id:${cartId}`) 
})

//GET

router.get(RUTA_CARRITO, (req, res) => {
    cartsContainer.readAll()
    cartsContainerFB.readAll()
    res.json(carts)
})

router.get(RUTA_CARRITO, cartNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const cartFound = carts.find(cart => cart.id === id);
    cartsContainer.readById(idStr)
    cartsContainerFB.readById(idStr)
    res.json(cartFound)
})

//DELETE

router.delete(RUTA_CARRITO_ID, cartNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const newCarts = carts.filter(cart => cart.id !== id);
    cartsContainer.deleteOneCart(idStr)
    cartsContainerFB.deleteOneCart(idStr)
    res.json({newCarts})
})

router.delete('/carrito/:id/productos/:id_prod', cartNotFound, (req, res) => {
    const cartId = parseInt(req.params.id);
    const cartIdStr = req.params.id
    const prodId = parseInt(req.params.id_prod);
    const prodIdStr = req.params.id_prod;
    const cartFound = carts.find(cart => cart.id === cartId);
    const productDeleted = cartFound.products.filter(prod => prod.id === prodId);

    cartsContainer.deleteOneProductFromCart(cartIdStr, prodIdStr)
    res.json(productDeleted)
})