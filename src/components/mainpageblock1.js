import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import './styles/MainpageBlock1.css';
import * as $ from 'jquery';


export default function MainpageBlock1(props) {
    return (
        <React.Fragment>
            <div className='backgr container-fluid p-0'>
                    <div id='maincard1container' className='container-fluid d-flex justify-content-center pt-4 pb-4 p-0'>
                        <div id='o-1' className='col-11'>

                        <div id='maincard1' className="card" >
                                <div className="row no-gutters">

                                    <div id="jfn67" className="col-md-6">
                                        <div className="card-body">
                                            <h5 className="card-title">Наш крутой тезис</h5>
                                            <p className="card-text">Вот, почему мы крутые</p>
                                        </div>
                                    </div>

                                    <div id='videopromo1' className="card col-md-6 align-self-end">
                                        <div className="card-body p-1">
                                            <video  src="./../../public/videoplayback.mp4 " type="video/mp4"
                                                    preload="auto" autoPlay={true} loop={true} muted="muted"/>
                                        </div>
                                    </div>

                                </div>
                        </div>

                        <div id='maincard1btns' className="card ml-auto mr-auto mt-5 mb-5 col-11 " >
                                <div id='ntn-90' className="card-body p-2">
                                    <form className="form-inline p-0 my-2 my-lg-0 position-relative w-100 h-100">
                                        <button id='ntn-91' className="btn btn-mb1 btn-outline-success btn-mainpageblock1" type="submit">Попробуй бесплатно</button>
                                        <button id='ntn-92' className="btn btn-mb1 btn-outline-success btn-mainpageblock1" type="submit">Подробнее</button>
                                    </form>
                            </div>
                        </div>

                        </div>
                    </div>
                </div>
        </React.Fragment>
    );
}

