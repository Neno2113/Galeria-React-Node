'use strict';


var validador = require('validator');
var fs = require('fs');
var path = require('path');
var Galeria = require('../models/galeria');
// var mongoosePaginate = require('mongoose-paginate-v2');

// var pagination = Galeria.plugin(mongoosePaginate);

var controller = {


    save: (req, res) => {
        var params = req.body;

        // console.log(params);
        //validar datos(validator)
        try {
            var validate_title = !validador.isEmpty(params.title);
        } catch (error) {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        if(validate_title){
            var galeria = new Galeria();

            //asignar valores al objeto article
            galeria.title = params.title;
            if(params.image){
                galeria.image = params.image
            }else{
                galeria.image = null;
            }

            //Guardar imagen 
            galeria.save((err, galeriaStored) => {
                if(err || !galeriaStored){
                    return res.status(404).send({
                        status: "Error",
                        message: "La imagen no se ha guardado"
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        galeria: galeriaStored
                    });
                }
            })
        }else{
            return res.status(200).send({
                status: "Error",
                message: "Datos invalidos"
            })
        }
    },

    galerias: (req, res) => {
        var query = Galeria.find({});

        query.sort("-_id").exec((err, galeria)=>{
            if (err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al devolver datos"
                });
            }

            if(!galeria){
                return res.status(404).send({
                    status: "Error",
                    message: "No hay nada en la galeria para mostrar"
                });
            }

            return res.status(200).send({
                status: "success",
                galeria,
            });
        });
    },

    GaleriaPagination: (req, res) => {
        const limit = req.query.limit || 6;
        const page = req.query.page || 1;

        const options = {
            page: 1,
            limit: limit,
            page: page,
            sort: { date: -1 },
        };

        Galeria.paginate({}, options, (err, galeriasStored) => {
            if(err){
                return res.status(500).send({
                status: "error",
                message: "Ocurrio un error"
                });
            }
            if(!galeriasStored){
                return res.status(404).send({
                    status: "Error",
                    message: "No hay nada que mostrar"
                });
            }

            return res.status(202).send({
                status: "success",
                galeria: galeriasStored
            });
        
        });
       

    },

    upload: (req, res) => {
        //configurar el modulo del connect-multipaty router/galeria.js


        var file_name = "Imagen no subida....";

        if(!req.files){
            return res.status(404).send({
                status: "Error",
                message: file_name,
                file: req.files
            });
        }

        //Conseguir nombre y extension del archivo
        var file_path = req.files.file0.path;
     
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
       

        var extension_split = file_name.split('\.');
        
        var file_ext = extension_split[1];

        //Comprobar la extension, solo imagenes, Si no es validar borrarlo
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //Si no cumple, borrar archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: "Error",
                    message: "Imagen no valida"
                });
            });
        } else {
            var galeriaId = req.params.id;

            if(galeriaId){
                //Buscar galeria y asignarle el nombre de la imagen
                Galeria.findByIdAndUpdate({_id: galeriaId}, {image: file_name}, {new:true}, (err, galeriaUpdated) => {
                    if(err || !galeriaUpdated){
                        return res.status(500).send({
                            status: "Error",
                            message: "Error el guardar la imagen"
                        });
                    }

                    return res.status(200).send({
                        status: "success",
                        galeria: galeriaUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    status: "Error",
                    image: file_name
                });
            }
        }
    },

    getImage: (req, res) => {
        // recibir imagen
        var file  = req.params.image;
        //Ruta del archivo
        var path_file = './upload/galeria/'+ file;


        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: "Error",
                    message: "No se encontro la imagen."
                })
            }
        });
    },

    getImagenGaleria: (req, res) => {
        var id = req.params.id;

        if (!id  || id == null){
            res.status(404).send({
                status: "failed",
                message: "Ocurrio un error"
            });
        } else {
            Galeria.findById(id, (err, galeriaUnit) => {
                if(err || !galeriaUnit){
                    res.status(404).send({
                        status: "failed",
                        message: "No se encontro la imagen"
                    });
                } else {
                    res.status(200).send({
                        status: "success",
                        galeria: galeriaUnit
                    })
                }
            })
        }

     
    },

    update: (req, res) => {
        console.log(req.params);
        var id = req.params.id;
    

        let params = req.body;

        try {
            var validate_title = !validador.isEmpty(params.title);
        } catch (error) {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        if(validate_title){
            Galeria.findByIdAndUpdate({_id: id },params,{new: true}, 
                (err, galeriaUpdated) => {
                    if(err) {
                        return res.status(500).send({
                            status: "Error",
                            message: "Error al actualizar"
                        });
                    }

                    if(!galeriaUpdated){
                        return res.status(404).send({
                            status: "Error",
                            message: "No existe la galeria!!"
                        });
                    }

                    return res.status(200).send({
                        status: "success",
                        galeria: galeriaUpdated
                    })
                }

            )
        } else {
            return res.status(200).send({
                status: "Error",
                message: "La validacion no es correcta"
            });
        }
    },

    delete: (req, res) => {
        let id = req.params.id;
        
        Galeria.findOneAndDelete({_id: id}, (err, galeriaRemoved) => {
            if(err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al borrar!!"
                });
            }

            if(!galeriaRemoved){
                return res.status(404).send({
                    status: "Error",
                    message: "No se ha encontrado la entrada!!"
                });
            }


            return res.status(200).send({
                status: "success",
                galeria: galeriaRemoved
            });
        });



    }


};

module.exports = controller;