import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom"


import Home from "./components/Home";
import Formulario from "./components/Formulario";
import Menu from "./components/Menu";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Galeria from "./components/Galeria";
import EditFormulario from "./components/EditFormulario";

class Router extends Component {
    
    render(){
        return (

            <BrowserRouter>
                <Header></Header>
                <Menu></Menu>
                <div className="content">
                    <Switch>
                        <Route exact path="/" component={Home}></Route>
                        <Route exact path="/home" component={Home}></Route>
                        <Route exact path="/formulario" component={Formulario}></Route>
                        <Route exact path="/galeria/imagen/:id" component={Galeria}></Route>
                        <Route exact path="/galeria/editar/:id" component={EditFormulario}></Route>
                    </Switch>
                
                </div>
                <Footer></Footer>
            </BrowserRouter>

        );
    }
}


export default Router;