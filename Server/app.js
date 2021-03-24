'use strict'


//Modulos servidor
var express = require('express');
var bodyParser = require('body-parser');


//Ejecutar Express
var app = express();


//Rutas
var galeria_routes = require('./routes/galeria');


//Middlewares
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//Agregar prefijos a rutas
app.use('/api', galeria_routes);



//Exportar modulo (fichero actual)
module.exports = app;