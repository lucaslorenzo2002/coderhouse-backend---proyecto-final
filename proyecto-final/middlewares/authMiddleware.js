let administrador = false

const notAnAdmin = (req, res, next) => {
    if(administrador = false){
        res.status(404).json({error: 'necesitas ser administrador para acceder a esta funcion'})
    } else{
        next()
    }
}

module.exports = {notAnAdmin}