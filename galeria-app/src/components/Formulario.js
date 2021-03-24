import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import  axios  from "axios";
import Swal from "sweetalert2";
import Global from "../Global";



class Formulario extends Component {

    constructor(){
        super();
        this.validator = new SimpleReactValidator({
            messages: {
                required: "Este campo es requerido."
            }
        })
    }


    url = Global.url;
    titleRef = React.createRef();
    fileRef = React.createRef();


    state = {
        galeria: {},
        status: null,
        selectedFile: null
    };

    changeState = () => {
        this.setState({
            galeria: {
                title: this.titleRef.current.value
            }
        })
    }

    saveArticle = (e) => {
        e.preventDefault();
        
        //Rellenar state con formulario
        this.changeState();

        if(this.validator.allValid()){

            axios.post(this.url+'save', this.state.galeria)
                .then(res => {
                    if(res.data.galeria){
                        this.setState({
                            galeria: res.data.galeria,
                            status: "waiting"
                        });

                        //Subir imagen 
                        if(this.state.selectedFile !== null){
                            //Sacar id de la galeria
                            var galeriaId = this.state.galeria._id;
                            //Crear FormData para enviar la imagen
                            const formData = new FormData();
                            //Agregando imagen al formdata
                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );
                            axios.post(this.url+'upload-image/'+ galeriaId, formData)   
                                .then(res => {
                                    if(res.data.galeria){
                                        this.setState({
                                            galeria: res.data.galeria,
                                            status: "success"
                                        });

                                        //sweetalert
                                        Swal.fire(
                                            'Entrada a galeria creada!',
                                            'Has creado una entrada a galeria exitosamente.',
                                            'success'
                                        ) 
                                    }else {
                                        this.setState({
                                            galeria: res.data.galeria,
                                            status: "failed"
                                        });
                                    }
                                })

                        } else{
                            this.setState({
                                status: "success"
                            });
                            
                            //sweetalert
                            Swal.fire(
                                'Entrada a galeria creada!',
                                'Has creado una entrada a galeria exitosamente.',
                                'success'
                            )   
        
                        }

                    } else {
                        this.setState({
                            status: 'failed'
                        });
                    }
                })
        } else {
            this.setState({
                status: 'failed'
            });

            this.validator.showMessages();
            this.forceUpdate();    
        }


    }

    fileChange = (event) => {
       this.setState({
           selectedFile: event.target.files[0] 
       });
    }


    render(){

        if(this.state.status === 'success'){
            return <Redirect to="/home"></Redirect>
        }
        return (
            <form action="" onSubmit={this.saveArticle}>
                <ul className="formulario">
                    <li className="form-row">
                        <h3>Formulario</h3>
                       
                    </li>
                
                    <li className="form-row">
                        <label htmlFor="Nombre">Nombre Foto</label>
                        <input type="text" name="title" id="" className="form-input name"  ref={this.titleRef} onChange={this.changeState}/>
                       
                    </li>
                    <li className="form-row alert">
                        {this.validator.message('title', this.state.galeria.title, 'required')}
                    </li>
              
                    <li className="form-row">
                        <label htmlFor="Nombre">Elige una imagen</label>
                        <input type="file" name="file0" id="" className="form-input" onChange={this.fileChange}/>
                  
                    </li>
                    <li className="form-row alert">
                        {this.validator.message('file0', this.state.selectedFile, 'required')}
                    </li>
                    <li className="form-row">
                        <input type="submit" value="Subir" className="boton btn-enviar"/>
                    </li>
                
                </ul>
           
            </form>
        );
    }
}


export default Formulario;