import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import './styles/MainpageBlock4.css';
import * as $ from 'jquery';
export default function MainPageBlock4(props) {
    return (
        <React.Fragment>
            <div className='backgr container-fluid p-0'>
                <div className='container-fluid finishcardmainpage p-5 '>
                    <div className="card">
                        <div className="card-header finishinviteheadermainpage">
                            ПОКУПАААААЙ
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">КУПИИИИИИИИИИИ</h5>
                            <p className="card-text">ТЫ ДОЛЖЕН КУПИТЬ</p>
                            <a href="#" className="btn btn-mb2 btn-primary">ТЫК, ЧТОБЫ КУПИТЬ</a>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}