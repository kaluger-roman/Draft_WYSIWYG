import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import './styles/carouselmainpage.css';
import * as $ from 'jquery';

export default function MainPageCarousel(props) {
    const dispatch=useDispatch();//dispatch(exampleAyncAction())
    const selector=useSelector((state)=>{
        return state.exinit1
    });
    useEffect(()=>{ $('.carousel').carousel({
        interval: 7000,
    })});
    return(
        <React.Fragment>
            <div id="carouselExampleCaptions" className="carousel slide carousel-fade position-relative" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleCaptions" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
                </ol>

                <div className="carousel-inner">

                    <div className="carousel-item active bg-info">
                        <img src="./../../public/mini-razmer.jpg" className="d-block w-100 img-fluid rounded " alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Слоган</h5>
                            <p>Коротко о том, почему мы крутые</p>
                        </div>
                    </div>

                    <div className="carousel-item bg-danger">
                        <img src="./../../public/6_(4).jpg" className="d-block w-100 img-fluid rounded" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Еще слоган</h5>
                            <p>Да, мы крутые</p>
                        </div>
                    </div>
                </div>

                <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </React.Fragment>
    )
}
