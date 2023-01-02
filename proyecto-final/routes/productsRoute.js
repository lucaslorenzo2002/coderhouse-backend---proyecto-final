const { postProduct, getAllProducts, updateProduct, deleteOneProduct, getOneProduct } = require('../controllers/productsController');
const { notAnAdmin } = require('../middlewares/authMiddleware');
const { productNotFound } = require('../middlewares/errorMiddleware');
const productRouter = require('./router')

//RUTAS
const RUTA_PRODUCTOS = '/productos';
const RUTA_PRODUCTOS_ID = '/productos/:id';

//POST

productRouter.post(RUTA_PRODUCTOS, notAnAdmin, postProduct)

//GET

productRouter.get(RUTA_PRODUCTOS_ID, productNotFound, getOneProduct)

productRouter.get(RUTA_PRODUCTOS, getAllProducts)

//PUT

productRouter.put(RUTA_PRODUCTOS_ID, notAnAdmin, productNotFound, updateProduct)

//DELETE

productRouter.delete(RUTA_PRODUCTOS_ID, notAnAdmin, productNotFound, deleteOneProduct)

module.exports = productRouter

