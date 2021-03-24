import React, { Component } from "react";
import { NavLink } from "react-router-dom";



class Menu extends Component {

    render(){
        return (
            <nav className="menu">
                <ul>
                    <li>
                        <NavLink exact to="/home" activeClassName="selected">Galeria</NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/formulario" activeClassName="selected">Formulario</NavLink>
                    </li>
                </ul>
            </nav>
        );
    }
}


export default Menu;