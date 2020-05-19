import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {VERTICAL_ORIENTATION_PAGE_CONST} from "../Service&SAGA/PageSizeConstants";

export const StatsInfoBlock=(props)=>{
    let pageImitationsCount=useSelector((state)=>state.Draft.pageImitationsCount);
    let orientation=useSelector((state)=>state.Draft.orientation);
    let editorState=props.editorState;

    let [symbolCount, setSymbolCount]=useState(0);
    let [wordsCount, setWordsCount]=useState(0);


    let curContent=editorState.getCurrentContent();


        setTimeout(()=>{
                let text=curContent.getPlainText();
                setSymbolCount(text.length);
                setWordsCount(text.split(/\b\W+\b/g).length);},
            0);



    return(
        <div style={{border:'1px ridge #fa33bb', display:'flex', height:'6vmin'}}>
            <div style={{borderRight:'1px ridge #fa33bb'}}>
                {pageImitationsCount} страниц
            </div>
            <div style={{borderRight:'1px ridge #fa33bb'}}>
                {orientation===VERTICAL_ORIENTATION_PAGE_CONST?'вертикальный':'горизонтальный'}
            </div>
            <div style={{borderRight:'1px ridge #fa33bb'}}>
                {wordsCount} слов
            </div>
            <div style={{borderRight:'1px ridge #fa33bb'}}>
                {symbolCount} символов
            </div>
        </div>
    )
};