const express = require('express');
const app = express();
const path = require('path');
const methodOverride =  require('method-override');

const port = process.env.PORT || 3000;

const mainRouters = require('./src/routers/mainRouter.js');
const productRouters = require ('./src/routers/productRouters.js');


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));  // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));


app.use(methodOverride('_method'));

//incluyo los dos paths, users y products para diferentes views.
app.set('views', [path.join(__dirname + '/src/views/users'), path.join(__dirname + '/src/views/products')]);

app.use(express.static(path.join(__dirname, './public')));

app.use('/', mainRouters);
app.use('/producto', productRouters);


app.listen (port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});