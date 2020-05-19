import React, {useCallback, useEffect, useMemo, useState} from "react";
import * as $ from 'jquery';
import {AtomicBlockUtils} from 'draft-js'
import {TABLE_ENTITY_TYPE} from "../../styles/ConstructorStyles/DraftStyles/NAMING_CONSTANTS";
import {CREATED_TABLES} from "../EmbedElements/TableEmbedElement";
import uniqid from 'uniqid';

const CellOfTableManage=(props)=>{
    let {row,column,setCurCellHover,curCellHover, onClick}=props;
    return(
        <div
            data-findkey={`${row} ${column}`}
            style={{border:'1px ridge #000',
                backgroundColor: ((row<=curCellHover.row)&&(column<=curCellHover.column))?'#5a5452':'#FFF',
                width:'100%',height:'100%'}}
            onMouseEnter={()=> setCurCellHover({row, column})}
            onMouseLeave={()=> setCurCellHover({row:undefined, column:undefined})}
            onClick={()=>onClick(row,column)}
        >
        </div>
    )
};

export const TableManageBlock=(props)=>{
    const [curCellHover, setCurCellHover]=useState({row:undefined, column:undefined});
    const {editorState, onChange}=props;

    let ret = useMemo(() => {
            let localret = [];
            for (let i = 1; i <= 8; i++) {
                for (let j = 1; j <= 8; j++) {
                    localret.push(<CellOfTableManage key={`${i} ${j}`}
                                                     row={i} column={j}
                                                     setCurCellHover={setCurCellHover}
                                                     curCellHover={curCellHover}
                                                     onClick={(row,col)=>createTableFunc(row,col)}
                    />)
                }
            }
            return localret;
        },
        [curCellHover]);

    let tooltipSizeEl = useMemo(() => {
            let curCellRect=curCellHover.row===undefined?{right:0, bottom:0}:$(`[data-findkey="${curCellHover.row} ${curCellHover.column}"]`)[0].getBoundingClientRect();


            return(
            <div id='tooltipTableSelectSizeControl' style={{border:'1px ridge #000',width:'4vmin', height:'3vmin',
                backgroundColor:'#FFF', position:"fixed",left:`${curCellRect.right+10}px`,
                top:`${curCellRect.bottom+10}px`,
                visibility: curCellHover.row===undefined?"hidden":"visible"
            }}>
                {`${curCellHover.row||0}x${curCellHover.column||0}`}
            </div>
        )
        },
        [curCellHover]);

    const createTableFunc=useCallback((rows,columns)=>{
        const tableID=uniqid('table_');

        const contentState = editorState.getCurrentContent();
        const selectionState=editorState.getSelection();

       /* if(selectionState.)
        var updatedSelection = selectionState.merge({
            focusKey: 'bar',
            focusOffset: 0,
        });
*/
        const contentStateWithEntity = contentState.createEntity(TABLE_ENTITY_TYPE, 'MUTABLE', {tableID});
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();


        CREATED_TABLES[tableID]={
            rows, columns
        };



        onChange(AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,'<<<<<TABLE>>>>>'));
    },[]);

    return (
        <div>
            <div id='tableSelectSizeControl'
                style={{border:'1px ridge #000', display:'grid',  gridTemplateColumns: 'repeat(8, 1fr)', width:'10vmin',height:'10vmin', padding:'0.2vmin', position:'relative', cursor:'pointer'}}>
                {ret}
            </div>
            {tooltipSizeEl}
            <div style={{border:'1px ridge #000',width:'10vmin',
                backgroundColor:'#FFF'}}>
                Другое...
            </div>
        </div>
    )
};