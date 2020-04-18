import React, {useCallback, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";
import '../styles/CommonComponentsStyles/HelpMessanging.css';
import * as $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

function OneMessage() {
    return(
    <div className='onemessageMessanging'>
        <div className='onemsgbg'>
            <p className='onemasg-meeesg'>
                FFEFfffffffffffffffffffffffffffffffffffffffffffffffhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
            </p>
        </div>
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
            $('#ShirmaHelpMesngmaindialog').animate({left:0}, 500);
            $("#HelpMessanging-maindialog").animate({top: '87vmin', left: '91.5vmax',width: '5vmax',height: '10.5vmin'},500);
            $("#maincontaineravatarHelpMessanging").animate({top: '86vmin', left: '91vmax',width: '6vmax',height: '12.5vmin'},500);

        }
        else {
            $('#ShirmaHelpMesngmaindialog').animate({left:'-100%'}, 500);
            $("#HelpMessanging-maindialog").animate({ top: '38.5vmin', left: '78vmax',width: '20vmax',height: '61vmin'},500).animate({left:'74vmax'}, 300);
            $("#maincontaineravatarHelpMessanging").animate({top: '93vmin', left: '95vmax',width: '3vmax',height: '6.25vmin'},500);
            $("#HelpMessanging-mndg-header>span").animate({fontSize:'100%'},500);

        }
    };
    return (
        <React.Fragment>
            <div id='HelpMessanging-maindialog'>
                <div id='HelpMessanging-mndg-header'>
                    <img src='./../../public/logo192.png '/>
                    <div>Наш супер консультант готов на все</div>
                </div>
                <div id='HelpMessanging-mndg-mesbox'>
                    <OneMessage/>
                </div>
                <div id='HelpMessanging-mndg-inputbox'>
                    <form className='container-fluid p-0 m-0'>
                        <textarea  id='HelpMessanging-textarea'>
                        </textarea>
                        <div id='tableforbtnshelpmessg'>
                            <div id='HelpMessanging-submitbtn'>
                                <img  src='./../../public/icons8arrow.png'/>
                            </div>
                            <div id='HelpMessanging-btnholder'>
                                <img  src='./../../public/icons8arrow.png'/>
                            </div>
                        </div>
                    </form>

                </div>
                <div id={'ShirmaHelpMesngmaindialog'}></div>
            </div>
            <div id='maincontaineravatarHelpMessanging' onClick={()=>{OpenCLoseFunc(); toggleOpen(!isMesOpen)}}>
                <img id='avatarHelpMessanging' src='./../../public/logo192.png '/>
            </div>
        </React.Fragment>
    );
}