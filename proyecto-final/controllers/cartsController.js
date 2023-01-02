const asyncHandler = require('express-async-handler');


//FUNCIONES DE FS
const { writeFile } = require('../container/fsContainer')
const { getAll } = require('../container/fsContainer')

//REQUIRE A CLASES DE FIRESTORE
const { cartsFBCRUD } = require('../container/firebaseContainer');

//CONTENEDOR DE FIRESTORE
const cartsContainerFB = new cartsFBCRUD('carts');

//CONEXION MONGOOSE
const connection = require('../config/mongoConfig')

//REQUIRE A CLASES DE MONGOOSE
const { cartsCRUD } = require('../container/mongoContainer');

//CONTENEDOR DE MONGOOSE
const cartsContainer = new cartsCRUD(connection);

let carts = []

//POST

const postCart = asyncHandler(async(req, res) => {
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

const postProdIntoCart = asyncHandler(async (req, res) => {
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

const getCarts = asyncHandler(async (req, res) => {
    cartsContainer.readAll()
    cartsContainerFB.readAll()
    res.json(carts)
});

const getOneCart = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const cartFound = carts.find(cart => cart.id === id);
    cartsContainer.readById(idStr)
    cartsContainerFB.readById(idStr)
    res.json(cartFound)
});

const deleteOneCart = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const newCarts = carts.filter(cart => cart.id !== id);
    cartsContainer.deleteOneCart(idStr)
    cartsContainerFB.deleteOneCart(idStr)
    res.json({newCarts})
});

const deleteOneProductFromCart = asyncHandler(async (req, res) => {
    const cartId = parseInt(req.params.id);
    const cartIdStr = req.params.id
    const prodId = parseInt(req.params.id_prod);
    const prodIdStr = req.params.id_prod;
    const cartFound = carts.find(cart => cart.id === cartId);
    const productDeleted = cartFound.products.filter(prod => prod.id === prodId);

    cartsContainer.deleteOneProductFromCart(cartIdStr, prodIdStr)
    res.json(productDeleted)
})

module.exports = {postCart, postProdIntoCart, getCarts, getOneCart, deleteOneCart, deleteOneProductFromCart}