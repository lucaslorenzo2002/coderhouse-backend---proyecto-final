const {postCart, postProdIntoCart, getCarts, getOneCart, deleteOneCart, deleteOneProductFromCart} = require("../controllers/cartsController");
const { cartNotFound } = require("../middlewares/errorMiddleware");
const cartRouter = require('./router')

//RUTAS
const RUTA_CARRITO = '/carrito';
const RUTA_CARRITO_ID = '/carrito/:id';

//POST

cartRouter.post(RUTA_CARRITO, postCart)

cartRouter.post('/carrito/:id/productos/:id_prod', cartNotFound, postProdIntoCart)

//GET

cartRouter.get(RUTA_CARRITO, getCarts)

cartRouter.get(RUTA_CARRITO, cartNotFound, getOneCart)

//DELETE

cartRouter.delete(RUTA_CARRITO_ID, cartNotFound, deleteOneCart)

cartRouter.delete('/carrito/:id/productos/:id_prod', cartNotFound, deleteOneProductFromCart)

module.exports = cartRouter