import React, { Component } from "react";
import axios from "axios";
import Global from "../Global";
import SimpleReactValidator from "simple-react-validator";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import img from "../assets/images/img.jpg";


class EditFormulario extends Component {

    constructor(){
        super();
        this.validator = new SimpleReactValidator({
            messages: { 
                required:"Este campo es requerido"
            }
        });
    }

    url = Global.url;
    titleRef = React.createRef();
    galeria_id = null;

    state = {
        galeria: {},
        status: null,
        selectedFile: null
    }

    componentDidMount(){
        this.galeria_id = this.props.match.params.id;
        this.getGaleria(this.galeria_id);
    }

    changeState = () => {
        this.setState({
            galeria: {
                title: this.titleRef.current.value,
                image: this.state.galeria.image
            }
        })

        this.validator.showMessages();
        this.forceUpdate();
    }


    getGaleria = (id) => {
        axios.get(this.url +'galeria/imagen/'+id)
            .then(res => {
                this.setState({
                    galeria: res.data.galeria
                })

                // console.log(this.state.galeria);
            });
    }

    saveArticle = (e) => {
        e.preventDefault();

        this.changeState(); 
        console.log(this.state);
        if(this.validator.allValid()){
            axios.put(this.url+'update/'+this.galeria_id, this.state.galeria)
                .then(res => {
                    if(res.data.galeria){

                        this.setState({
                            galeria: res.data.galeria,
                            status: "waiting"
                        })

                        if(this.state.selectedFile !== null){

                            let id = this.state.galeria._id;

                            const formData = new FormData();

                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            )
                            axios.post(this.url+'upload-image/'+id, formData)
                                .then(res => {
                                    if(res.data.galeria){
                                        this.setState({
                                            galeria : res.data.galeria,
                                            status: "success"
                                        })

                                        //sweetalert
                                        Swal.fire(
                                            'Entrada a galeria actualizada!',
                                            'Has actualizado una entrada a galeria exitosamente.',
                                            'info'
                                        ) 
                                    } else {
                                        this.setState({
                                            galeria: res.data.galeria,
                                            status: "failed"
                                        })
                                    }
                                })
                        } else {
                            this.setState({
                                galeria: res.data.galeria,
                                status: 'success'

                            })

                            //sweetalert
                            Swal.fire(
                                'Entrada a galeria actualizada!',
                                'Has actualizado una entrada a galeria exitosamente.',
                                'info'
                            ) 
                        }
                    
                    } else {
                        this.setState({
                            status: 'failed'

                        })


                        //sweetalert
                        Swal.fire(
                            'Ocurrio un error!!',
                            'Ha ocurrido un error en la actualizacion de la galeria..',
                            'error'
                        ) 
                    }
                })
        } else {
            this.setState({
                status: "failed"
            })

            this.validator.showMessages();
            this.forceUpdate();
        }


    }

    fileChange = (e) => {
        this.setState({
            selectedFile:e.target.files[0] 
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
                        <label htmlFor="Nombre">Nombre Foto</label>
                        <input type="text" name="title" id="" defaultValue={this.state.galeria.title} className="form-input name"  ref={this.titleRef} onChange={this.changeState}/>
                       
                    </li>
                    <li className="form-row alert">
                        {this.validator.message('title', this.state.galeria.title, 'required')}
                    </li>

                    <li className="form-row">
                        <div className="img-edit">
                            {this.state.galeria.image !== null ? (
                                <img src={this.url+'get-image/'+ this.state.galeria.image} alt={this.state.galeria.title}  className="thumb"/>
                            ) : (
                                <img src={img} alt={this.state.galeria.title}  className="thumb"/>
                            )

                            }
                       
                        </div>
                    </li>
              
                    <li className="form-row">
                        <label htmlFor="Nombre">Elige una imagen</label>
                     
                     
                        <input type="file" name="file0" id="" className="form-input" onChange={this.fileChange}/>
                  
                    </li>
                    <li className="form-row alert">
                        {/* {this.validator.message('file0', this.state.selectedFile, 'required')} */}
                    </li>
                    <li className="form-row">
                        <input type="submit" value="Subir" className="boton btn-enviar"/>
                    </li>
                
                </ul>
           
            </form>
        );
    }
}


export default EditFormulario;