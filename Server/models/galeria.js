'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');


var GaleriaSchema = Schema({
    title: String,
    date: {type: Date, default: Date.now},
    image: String
});

GaleriaSchema.plugin(mongoosePaginate);

// const galeria = mongoose.model('Galeria', GaleriaSchema);

// galeria.paginate().then({});

module.exports = mongoose.model('Galeria', GaleriaSchema);
