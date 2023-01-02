const express = require('express');
const { json } = require('express');

const app = express();

const  productRouter  = require('./routes/productsRoute');
const  cartRouter  = require('./routes/cartsRoute');

const exphbs = require('express-handlebars');
const path = require('path');

//CONEXION A MONGOOSE
const connection = require('./config/mongoConfig')

connection
.then(() => console.log('mongoose conectado'))
.catch((err) => console.log(err))

//CONEXION A FIREBASE


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
app.use('/api', productRouter)
app.use('/api', cartRouter)

