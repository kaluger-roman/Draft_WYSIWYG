import React, {useRef} from "react";
import {Editor} from "draft-js";
import {TABLE_CELL_TYPES} from "./TableUtils";
import {useDispatch, useSelector} from "react-redux";
import {
    DraftInsertColumnTable, DraftInsertRowTable,
    DraftNeedShowInsertColumnSign, DraftNeedShowInsertRowSign,
    DraftSelectTableColumn,
    DraftSelectTableRow
} from "../../../../redux/actions";
import './../../../styles/CommonStyles/commonstyles.css'
import {InnerEmbedEditor} from "../InnerEmbedEditor";

window.addEventListener('mouseup',()=>{
    setCurRowSelectionEndId(undefined);
    setCurRowSelectionStartId(undefined);
    setCurColSelectionStartId(undefined);
    setCurColSelectionEndId(undefined);
});

export const setCurRowSelectionStartId=(val)=>{curRowSelectionStartId=val}
export const setCurRowSelectionEndId=(val)=>{curRowSelectionEndId=val}

let curRowSelectionStartId;
let curRowSelectionEndId;

export const setCurColSelectionStartId=(val)=>{curColSelectionStartId=val}
export const setCurColSelectionEndId=(val)=>{curColSelectionEndId=val}

let curColSelectionStartId;
let curColSelectionEndId;

export const TableEmbedCell =(props)=>{
    const {id,colspan,rowspan,editorState,colInx, rowInx,tableID,isAllCellsReadOnly,onChange,CONFIG_TABLE_PARAMS}=props;
    //const DomEditorRef=useRef(null);
    let {IdCellsRowToShowInsertSign,IdCellsColToShowInsertSign} = useSelector(state=>state.Draft);
    let dispatch=useDispatch();

    return(
        <td
            colSpan={colspan}
            rowSpan={rowspan}
            id={id}
            style={{border:`1px solid black`, minWidth:CONFIG_TABLE_PARAMS.minCellWidth+'px'}}
            onClick={()=>{
                //DomEditorRef.current.focus();
            }}
        >
            {colInx === 1 ?
                <div

                     onMouseDown={(e)=>{
                         e.preventDefault();
                         e.stopPropagation();
                         curRowSelectionStartId=id;
                         curRowSelectionEndId=id;
                         dispatch(DraftSelectTableRow([curRowSelectionStartId,curRowSelectionEndId]))}
                     }
                     onMouseEnter={(e)=>{
                         if (curRowSelectionStartId){
                             curRowSelectionEndId=id;
                             dispatch(DraftSelectTableRow([curRowSelectionStartId,curRowSelectionEndId]))
                         }}
                     }
                     onClick={(e)=>{e.preventDefault();e.stopPropagation()}}
                     style={{position: "absolute", left: "-30px", top: '0%', width: '30px', height: '100%', cursor: `url("./../../../../../public/Cursors/arrow-23645.png") 10 0, auto`}}>
                </div>
                : undefined
            }
            {rowInx === 0 ?
                <div
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        curColSelectionStartId=id;
                        curColSelectionEndId=id;
                        dispatch(DraftSelectTableColumn([curColSelectionStartId,curColSelectionEndId]))}
                    }
                    onMouseEnter={(e)=>{
                        if (curColSelectionStartId){
                            curColSelectionEndId=id;
                            dispatch(DraftSelectTableColumn([curColSelectionStartId,curColSelectionEndId]))
                        }}
                    }
                    onClick={(e)=>{e.preventDefault();e.stopPropagation()}}
                     style={{position: "absolute", left: "0%", top: '-30px', width: '100%', height: '30px', cursor: `url("./../../../../../public/Cursors/arrowdown-23645.png") 10 0, auto`}}>
                </div>
                : undefined
            }
            {rowInx === 0 ?
                <div
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(DraftInsertColumnTable(id))}
                    }
                    onMouseEnter={(e)=> dispatch(DraftNeedShowInsertColumnSign(id))}
                    onMouseLeave={(e)=> dispatch(DraftNeedShowInsertColumnSign(undefined))}

                    onClick={(e)=>{e.preventDefault();e.stopPropagation()}}
                    className={'VisibleInnerImgOnHover'}
                    style={{position: "absolute", left: 'calc(100% - 10px)', top: '-20px', width: '20px', height: '20px', cursor: `pointer`,zIndex:'2'}}>
                    <img style={{width:'20px', height:'20px'}} src={`./../../../../../public/ArrowIN.png`}/>
                </div>
                : undefined
            }
            {colInx === 1 ?
                <div
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(DraftInsertRowTable(id))}
                    }
                    onMouseEnter={(e)=> dispatch(DraftNeedShowInsertRowSign(id))}
                    onMouseLeave={(e)=> dispatch(DraftNeedShowInsertRowSign(undefined))}

                    onClick={(e)=>{e.preventDefault();e.stopPropagation()}}
                    className={'VisibleInnerImgOnHover'}
                    style={{position: "absolute", left:'-20px' , top: 'calc(100% - 15px)', width:"20px", height: '100%', cursor: `pointer`,zIndex:'2'}}>
                    <img style={{width:'20px', height:'20px'}} src={`./../../../../../public/ArrowINRIGHT.png`}/>
                </div>
                : undefined
            }

            <div style={{width:'10px', height:'100%',
                borderLeft:`1px solid black`, borderRight:`1px solid black`,
                backgroundColor:`white`, zIndex:'1', position:'absolute',
                left:'calc(100% - 5px)', top:'0%', visibility: `${(IdCellsColToShowInsertSign && IdCellsColToShowInsertSign.includes(id))?'visible':"hidden"}`
            }}>
            </div>
            <div style={{height:'10px', width:'100%',
                borderTop:`1px solid black`, borderBottom:`1px solid black`,
                backgroundColor:`white`, zIndex:'1', position:'absolute',
                left:'0%', top:'calc(100% - 5px)', visibility: `${(IdCellsRowToShowInsertSign && IdCellsRowToShowInsertSign.includes(id))?'visible':"hidden"}`
            }}>
            </div>
            <InnerEmbedEditor
                editorState={editorState}
                onChange={onChange}
                outerReasonReadOnly={isAllCellsReadOnly}
                id={id}
            />
           {/* <Editor
                editorState={editorState}
                onChange={(editorState)=>{onChange(editorState, id)}}
                ref={DomEditorRef}
                readOnly={isAllCellsReadOnly}
                handleKeyCommand={(command,editorState)=>HandleKeyCommandFactory(onChange)(command,editorState)}
            />*/}
        </td>
    )
}