import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import '../styles/stylesformainpage/MainPageBlock2.css';
import * as $ from 'jquery';

export default function MainpageBlock2(props) {
    return (
        <React.Fragment>
            <div className='backgr'>
            <div id='maincard2container' className='container-fluid d-flex justify-content-center pt-4 pb-4 p-0'>
                <div id='maincard2' className="card mb-3 col-11 " >
                    <div className="row no-gutters">

                        <div id='videopromo2' className="card col-md-6 align-self-start">
                            <div className="card-body p-1">
                                <img id='promo-img-mainblock1' src='./../../public/Zaltsman_2.png'/>
                            </div>
                        </div>



                        <div id="yui-34" className="col-md-6 border-left ">
                            <div className="card-body">
                                <h5 className="card-title">Наш крутой тезис</h5>
                                <p className="card-text">Вот, почему мы крутые</p>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
            </div>
        </React.Fragment>
    );
}

