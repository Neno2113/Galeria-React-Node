'use strict';


var express = require('express');
var GaleriaController = require('../controllers/galeria');


var router = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/galeria'});



//rutas
router.post('/save', GaleriaController.save);
// router.get('/galeria', GaleriaController.galerias);
router.post('/upload-image/:id?', md_upload, GaleriaController.upload);
router.get('/get-image/:image', GaleriaController.getImage);
router.get('/galeria/imagen/:id?', GaleriaController.getImagenGaleria);
router.put('/update/:id', GaleriaController.update);
router.delete('/delete/:id', GaleriaController.delete);
router.get('/galeria', GaleriaController.GaleriaPagination);




module.exports = router;
