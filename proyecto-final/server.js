const express = require('express');
const fs = require('fs')
const { json } = require('express');
const{ Router } = express;

const app = express();
const router = new Router();

const exphbs = require('express-handlebars');
const path = require('path');

app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

const PORT = 8080

const server = app.listen(process.env.PORT || PORT, () => {
    console.log(` server listening on PORT: ${PORT}`)
})

server.on('error', err => console.log(err))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api', router)

//FUNCIONES DE FS

const writeFile = async(data, file) => {
    try{
        await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
        console.log('producto agregado');
    }catch(err){
        throw new Error('hubo un error: ' + err)
    }
}

const getAll = async(file) => {
    try{
        let productos =  await fs.promises.readFile(file, 'utf-8');
        return JSON.parse(productos); 
        } catch(err){
            if(err.message.includes('no such file or directory')) return [];
            console.log('error: ' + err);
    }
}
//RUTAS

const RUTA_PRODUCTOS = '/productos';
const RUTA_PRODUCTOS_ID = '/productos/:id';
const RUTA_CARRITO = '/carrito';
const RUTA_CARRITO_ID = '/carrito/:id';

//MIDDLEWARES

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

//RUTAS DE PRODUCTOS

let products = [];

//POST

router.post(RUTA_PRODUCTOS, notAnAdmin, (req, res) => {
    const newId = products.length + 1;
    const newProduct = {id: newId, ...req.body};
    products.push(newProduct)
    writeFile(products, 'productos.txt')
    res.send(`producto agregado - id: ${newId}`)
})

//GET

router.get(RUTA_PRODUCTOS_ID, productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const productFound = products.find(prod => prod.id === id);
    res.json(productFound)
})

router.get(RUTA_PRODUCTOS, (req, res) => {
    res.json(products)
})

//PUT

router.put(RUTA_PRODUCTOS_ID, notAnAdmin, productNotFound, (req, res) => {
    const id = parseInt(req.params.id)
    const newData = req.body
    const newProduct = products.map(p => p.id === id ? {...p, newData} : p)
    res.json()
})

//DELETE

router.delete(RUTA_PRODUCTOS, notAnAdmin, (req, res) => {
    products = []
    res.json(products)
})

router.delete(RUTA_PRODUCTOS_ID, notAnAdmin, productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const deleteProductFound = products.filter(p => p.id !== id);
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
    writeFile(carts, 'carts.txt')
    carts.push(newCart)
    res.send(`carrito agregado - id:${newId}`)
})

router.post('/carrito/:id/productos/:id_prod', productNotFound, (req, res) => {
    const cartId = parseInt(req.params.id);
    const prodId = parseInt(req.params.id_prod);
    const productFound = products.find(prod => prod.id === prodId);
    const cartFound = carts.find(cart => cart.id === cartId)
    cartFound.products.push(productFound)
    res.send(`producto - id: ${prodId} agregado al carrito - id:${cartId}`) 
})

//GET

router.get(RUTA_CARRITO, (req, res) => {
    res.json(carts)
})

router.get('/carrito/:id/productos', productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const cartFound = carts.find(cart => cart.id === id)
    res.json(cartFound.products)
})

//DELETE

router.delete(RUTA_CARRITO_ID, productNotFound, (req, res) => {
    const id = parseInt(req.params.id);
    const newCarts = carts.filter(cart => cart.id !== id);
    res.json({newCarts})
})

router.delete(RUTA_CARRITO, (req, res) => {
    carts = []
    res.json(carts)
})

router.delete('/carrito/:id/productos/:id_prod', productNotFound, (req, res) => {
    const cartId = parseInt(req.params.id);
    const prodId = parseInt(req.params.id_prod);
    const cartFound = carts.find(cart => cart.id === cartId);
    const productDeleted = cartFound.products.filter(prod => prod.id === prodId);
    res.json(productDeleted)
})