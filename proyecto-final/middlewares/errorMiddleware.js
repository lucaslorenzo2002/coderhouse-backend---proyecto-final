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

module.exports = {productNotFound, cartNotFound}