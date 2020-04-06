import React, {useCallback, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import './styles/mainpanel.css';
import * as $ from 'jquery';
import {ScrollDownAction, ScrollUpAction} from "../redux/actions";


export default function MainPanel(props) {
   /* const panelvisibleselector=useSelector((state)=>{
        return state.mainpage.isshown;
    });
    const scrollselector=useSelector((state)=>{
        return state.mainpage.scroll
    });*/

    return(
        <React.Fragment>
            <nav id='navmainid' className="navbar navbar-expand-lg navbar-collapse container-fluid bg-dark position-fixed">
                <a className="navbar-brand text-warning " href="#"><h1>PactaX</h1></a>
                <button className="navbar-toggler   " type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link " href="#">Disabled</a>
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