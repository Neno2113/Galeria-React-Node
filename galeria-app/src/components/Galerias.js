import  React,  { Component }  from "react";
import axios from "axios";
import Global from "../Global";
import img from "../assets/images/img.jpg";
import Moment from "react-moment";
import "moment/locale/es";
import { Link } from "react-router-dom";


class Galerias extends Component {

    url = Global.url;

    state = {
        galerias: [],
        status: null,
        paginator: []
    };

    componentDidMount(){
        this.getGaleria();
    }

    getGaleria = (page) => {
        if(page){
            axios.get(this.url+'galeria?page='+page)
            .then( res => {
                this.setState({
                    galerias: res.data.galeria.docs,
                    status: "success",
                    paginator: res.data.galeria
                });
                // console.log(this.state);
            });
        } else {
            axios.get(this.url+'galeria?page=1')
            .then( res => {
                this.setState({
                    galerias: res.data.galeria.docs,
                    status: "success",
                    paginator: res.data.galeria
                });
                // console.log(this.state);
            });
        }
     
    }

    nextPage = (page) => {
       
        this.getGaleria(page);
    }

    previousPage = (page) => {
       
        this.getGaleria(page);
    }

    seleccionPage = (page) => {
        this.getGaleria(page);
    }

    

    render(){
        // if(this.state.galerias.length >= 1){
            var listGaleria = this.state.galerias.map((galeria) => {
                return (
                    <article className="photo" key={galeria._id}>
                        <div className="image-wrap">
                            <Link to={'galeria/imagen/'+galeria._id}>
                            {galeria.image !== null ? (
                            <img src={this.url+'get-image/'+galeria.image} alt={galeria.title}/>
                            ) : (
                            <img src={img} alt={galeria.title}/>
                            )}
                            </Link>
                       

                        </div>
                        <div className="photo-info">
                            <h3>{galeria.title}</h3>
                            <span >
                                <Moment locale="es" fromNow>{galeria.date}</Moment>
                            </span>
                        </div>
                     
                    </article>
                
                )
            })
            const paginas = [];
            for (let index = 1; index <= this.state.paginator.totalPages; index++) {
                paginas.push(<li key={index}  class="page-item"><button class="page-link" onClick={
                    () => {
                        this.seleccionPage(index)
                    }
                }>{index}</button></li>)
                
            }



            return (
                <React.Fragment>
                    <div className="photos">
                        {listGaleria}
                    
                        
                    </div>
                    <nav aria-label="Page navigation example mt-5">
                        <ul class="pagination justify-content-center">
                          
                            {this.state.paginator.hasPrevPage !== false ? (
                                <li class="page-item">
                                    <button class="page-link" onClick={
                                        () => {
                                            this.previousPage(this.state.paginator.prevPage)
                                        }
                                    }>Previo</button>
                                </li>
                            ): (
                                <li class="page-item disabled">
                                <button class="page-link" onClick={
                                    () => {
                                        this.previousPage(this.state.paginator.prevPage)
                                    }
                                }>Previo</button>
                            </li>
                            )}
                          
                            {paginas}
                            {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li> */}
                            {this.state.paginator.hasNextPage !== false ? (
                                <li class="page-item">
                                    <button class="page-link" onClick={
                                        () => {
                                            this.nextPage(this.state.paginator.nextPage);
                                        }
                                    } >Siguiente</button>
                                </li>
                            ): (
                                <li class="page-item disabled">
                                <button class="page-link" >Siguiente</button>
                            </li> 
                            )}
                        
                        </ul>
                    </nav>
              </React.Fragment>
            )
         
        // }else if(this.state.galerias.length === 0 && this.state.status == 'success'){
        //     return (
        //         <div className="photos">
        //             <h3>No hay nada que mostrar</h3>
        //         </div>
        //     )
        // }
    }

}
export default Galerias;