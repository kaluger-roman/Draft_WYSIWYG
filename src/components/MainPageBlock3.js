import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import './styles/MainpageBlock3.css';
import * as $ from 'jquery';
import CardforMainPageBlock3 from "./cardforMainPageBlock3";

export default function MainpageBlock3(props) {

    return (
        <React.Fragment>
            <div className='backgr container-fluid p-0'>
            <div className='container-fluid dashboardcontainermainp p-5 '>
            <div className='container-fluid mb-5'>
                <span className='header-Mainpageb3'>
                    Супермотивирующий заголовок
                </span>
            </div>
            <div className="card-deck container-fluid p-0 m-0">
                <div className='row container-fluid  p-0 m-3 justify-content-around'>
                <CardforMainPageBlock3/>
                <CardforMainPageBlock3/>
                <CardforMainPageBlock3/>
                <CardforMainPageBlock3/>
                </div>

                <div className='row container-fluid  p-0 m-3 justify-content-around'>
                    <CardforMainPageBlock3/>
                    <CardforMainPageBlock3/>
                    <CardforMainPageBlock3/>
                    <CardforMainPageBlock3/>
                </div>
            </div>
            </div>
            </div>
        </React.Fragment>
    );
}

