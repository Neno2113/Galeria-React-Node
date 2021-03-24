import React, { Component } from "react";
import axios from "axios";
import Global from "../Global";
import img from "../assets/images/img.jpg";
import Moment from  "react-moment";
import 'moment/locale/es';
import Swal from "sweetalert2";
import { Link, Redirect } from "react-router-dom";


class Galeria extends Component {

    url = Global.url;


    state = {
        galeria: false,
        status: null
    }

    componentDidMount(){
        this.getGaleria();
    }


    getGaleria = () =>{
        var id = this.props.match.params.id;

        axios.get(this.url+'galeria/imagen/'+id)
            .then(res => {
                console.log(res.data.galeria);
                this.setState({
                    galeria: res.data.galeria,
                    status: "success"
                });
            })
            .catch(err => {
                this.setState({
                    galeria: false,
                    status: "success"
                });
            })
    }


    deleteGaleria = (id) => {
        Swal.fire({
            title: 'Estas seguro de borrar este articulo?',
            text: "No podras revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo!'
          }).then((result) => {
            if (result.value) {
                axios.delete(this.url+'delete/'+ id)
                    .then(res => {
                        this.setState({
                            galeria: res.data.galeria,
                            status: 'deleted'
                        })
                    })
              
            }else{
                Swal.fire(
                'Tranquilo!',
                'Tranquilo no se ha eliminado el articulo.',
                'info'
                )
            }
          })
    }


    render(){
        if(this.state.status === 'deleted'){
            Swal.fire(
            'Eliminado!',
            'La entrada a la galeria ha sido eliminada.',
            'success'
            )

            return <Redirect to='/home'></Redirect>
        }


        let galeria = this.state.galeria;

        return (
            <React.Fragment>
                  {this.state.galeria &&
                    <article className="photo-unit">
                        <div className="image-wrap">
                            {galeria.image !== null ? (
                                <img src={this.url+'get-image/'+galeria.image} alt={galeria.title}/>
                            ) : (
                                <img src={img} alt={galeria.title}/>
                            )
                        
                            }
                            
                        </div>
                        <div className="photo-info-unit">
                            <h3>{galeria.title}</h3>
                            <div className="btns">
                                <Link to={'/galeria/editar/'+galeria._id} className="boton btn-editar">Editar</Link>
                                <button className="boton btn-delete" onClick = {
                                    () => {
                                        this.deleteGaleria(galeria._id)
                                    }
                                }>Borrar</button>
                            </div>
                            <span >
                                <Moment locale="es" fromNow>{galeria.date}</Moment>
                            </span>
                        </div>
               
                    </article>
                    }
                    {!this.state.galeria && this.state.status === 'success' &&
                        <article className="photo-unit">

                         <div className="photo-info-unit">
                             <h3>Welp! no hay nada que mostrar</h3>
                             <span >
                                =C
                             </span>
                         </div>
                
                     </article>
                    }
                    {this.state.status == null &&
                        <article className="photo-unit">
                           <div className="photo-info-unit">
                               <h3>Cargando....</h3>
                               <span >
                                  =D
                               </span>
                           </div>
                       </article>
                    }
            </React.Fragment>
        )
    }
}

export default Galeria;