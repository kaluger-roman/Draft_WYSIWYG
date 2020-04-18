import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import '../styles/stylesformainpage/MainPageBlock3.css';
import * as $ from 'jquery';

export default function CardforMainPageBlock3(props) {
    return (
        <React.Fragment>
            <div className='card col-2  carddashboardmainpag3'>
                <div className='card-body'>
                    <div className="card front-side-1">
                        <img src="./../../public/logo192.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title">Название карточки</h5>
                            <p className="card-text">Что-то ну оооочень важное</p>
                            <p className="card-text"><small className="text-muted">Переверни</small></p>
                        </div>
                    </div>
                    <div className="card back-side-1">
                        <img src="./../../public/logo192.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            тут будет текст с ссылкой
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}