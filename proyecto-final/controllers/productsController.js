const asyncHandler = require('express-async-handler');

let products = [];

//FUNCIONES DE FS
const { writeFile } = require('../container/fsContainer')
const { getAll } = require('../container/fsContainer')

//REQUIRE A CLASES DE FIRESTORE
const { productsFBCRUD } = require('../container/firebaseContainer');

//CONTENEDOR DE FIRESTORE
const prodsContainerFB = new productsFBCRUD('products');

//CONEXION MONGOOSE
const connection = require('../config/mongoConfig')

//REQUIRE A CLASES DE MONGOOSE
const { productsCRUD } = require('../container/mongoContainer');

//CONTENEDOR DE MONGOOSE
const prodsContainer = new productsCRUD(connection);

//POST

const postProduct = asyncHandler(async (req, res) => {
    const newId = products.length + 1;
    const newProduct = {id: newId, ...req.body};
    products.push(newProduct)
    prodsContainer.createProduct(newProduct)
    prodsContainerFB.create(newProduct)
    writeFile(products, 'productos.txt')
    res.send(`producto agregado - id: ${newId}`)
})

//GET

const getOneProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const productFound = products.find(prod => prod.id === id);
    prodsContainer.readById(idStr)
    prodsContainerFB.readById(idStr)
    getAll('productos.txt')
    res.json(productFound)
})

const getAllProducts = asyncHandler(async (req, res) => {
    prodsContainer.readAll()
    prodsContainerFB.readAll()
    res.json(products)
});

//PUT

const updateProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    const newData = req.body
    products = products.map(p => p.id === id ? {...p, ...newData} : p);
    prodsContainer.update(idStr, newData)
    prodsContainerFB.update(idStr, newData)
    res.json({estado: 'producto actualizado con exito'})
});

const deleteOneProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const idStr = req.params.id
    let deleteProductFound = products.filter(p => p.id !== id);
    prodsContainer.deleteOne(idStr)
    prodsContainerFB.deleteById(idStr)
    res.json(deleteProductFound)
});

module.exports = {postProduct, getOneProduct, getAllProducts, updateProduct, deleteOneProduct}