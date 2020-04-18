import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import * as $ from 'jquery';
import '../styles/CommonComponentsStyles/floor.css'
export default function Floor(props) {



    return (
        <React.Fragment>
            <div className='backgr'>
            <div id='floor' className='container-fluid'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-2'>
                          <nav className="nav flex-column">
                              <span className="nav-link " href="#">Header</span>
                              <a className="nav-link" href="#">Link</a>
                              <a className="nav-link" href="#">Link</a>
                              <a className="nav-link " href="#">Link</a>
                          </nav>
                    </div>
                    <div className='col-2'>
                        <nav className="nav flex-column">
                            <span className="nav-link  " href="#">Header</span>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link " href="#" >Link</a>
                        </nav>
                    </div>
                    <div className='col-2'>
                        <nav className="nav flex-column">
                            <span className="nav-link " href="#">Header</span>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link " href="#">Link</a>
                        </nav>
                    </div>
                    <div className='col-2'>
                        <nav className="nav flex-column">
                            <span className="nav-link " href="#">Header</span>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link " href="#">Link</a>
                        </nav>
                    </div>
                    <div className='col-2'></div>
                </div>
                <br/>
                <br/>
                <div id='floor-down-mes' className='row justify-content-center align-content-center'>
                    Все права защищены и все такое
                </div>
                <br/>
                <div className='row justify-content-center'>
                    <div className='col-4 d-flex justify-content-center'>
                        <nav className="nav floor-downest-links">
                            <a className="nav-link " href="#">Link</a>
                            <a className="nav-link" href="#">Link</a>
                            <a className="nav-link" href="#">Link</a>
                        </nav>
                    </div>
                </div>
                <br/>
            </div>
            </div>
        </React.Fragment>
    );
}