import React, {useCallback, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import './styles/HelpMessanging.css';
import * as $ from 'jquery';
import {OpenCloseHelpMessenger, ScrollDownAction, ScrollUpAction} from "../redux/actions";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
import {Picker} from 'emoji-mart';

function OneMessage() {
    return(
    <div className='onemessageMessanging'>
        <img  src='./../../public/kisspng-callout-speech-balloon-clip-art-callout-5ac0b1acdbf6c6.993423511522577836901.png'/>
        <div>tgbetebtbtbwerbtr</div>
    </div>
    );
}

export default function HelpMessanging(props) {
    useEffect(()=>{
        $("#HelpMessanging-maindialog").draggable();

    });



    const [isMesOpen, toggleOpen] = useState(false);
    const OpenCLoseFunc=()=>{
        if(isMesOpen) {
            $("#HelpMessanging-maindialog").animate({top: '87vmin', left: '92vmax',width: '6vmax',height: '12.5vmin'},500);
            $("#maincontaineravatarHelpMessanging").animate({top: '87vmin', left: '92vmax',width: '6vmax',height: '12.5vmin'},500);
            $("#HelpMessanging-mndg-header>span").animate({fontSize:'20%'},500);

        }
        else {
            $("#HelpMessanging-maindialog").animate({ top: '38.5vmin', left: '78vmax',width: '20vmax',height: '61vmin'},500);
            $("#maincontaineravatarHelpMessanging").animate({top: '93vmin', left: '95vmax',width: '3vmax',height: '6.25vmin'},500);
            $("#HelpMessanging-mndg-header>span").animate({fontSize:'100%'},500);

        }
    };
    return (
        <React.Fragment>
            <div id='HelpMessanging-maindialog'>
                <div id='HelpMessanging-mndg-header'>
                    <img src='./../../public/logo192.png '/>
                    <span>Наш супер консультант готов на все</span>
                </div>
                <div id='HelpMessanging-mndg-mesbox'>
                    <OneMessage/>
                </div>
                <div id='HelpMessanging-mndg-inputbox'>
                    <form className='container-fluid p-0 m-0'>
                        <textarea  id='HelpMessanging-textarea'>
                        </textarea>
                        <img id='HelpMessanging-submitbtn' src='./../../public/icons8arrow.png'/>
                    </form>

                </div>
            </div>
            <div id='maincontaineravatarHelpMessanging' onClick={()=>{OpenCLoseFunc(); toggleOpen(!isMesOpen)}}>
                <img id='avatarHelpMessanging' src='./../../public/logo192.png '/>
            </div>
        </React.Fragment>
    );
}