import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import '../styles/CommonComponentsStyles/mainpanel.css';
import * as $ from 'jquery';
import {NavLink} from "react-router-dom";
import {Link} from "react-router-dom";

export default function MainPanel(props) {

    return(
        <React.Fragment>
            <nav id='navmainid' className="navbar navbar-expand-lg navbar-collapse container-fluid bg-dark position-fixed">
                <NavLink className="navbar-brand text-warning " to="/"><h1>PactaX</h1></NavLink>
                <button className="navbar-toggler   " type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/fdjmm">Dropdown <span className="sr-only">(current)</span></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/constructor" type='text/html'>Конструктор</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown
                            </NavLink>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="#">Action</Link>
                                <Link className="dropdown-item" to="#">Another action</Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="#">Something else here</Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link " to="#">Disabled</NavLink>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn btn-mp-1 btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        <button className="btn btn-mp-1 btn-outline-success my-2 my-sm-0 ml-5" type="submit">Регистрация</button>
                        <button className="btn btn-mp-1 btn-outline-success my-2 my-sm-0 ml-2" type="submit">Вход</button>

                    </form>
                </div>
            </nav>

        </React.Fragment>
    )
}