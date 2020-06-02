import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CompositeDecorator, Editor,ContentState, EditorState} from "draft-js";
//import * as $ from 'jquery';
//const jQuery=$;
import 'jquery-ui';
import '../../Service&SAGA/DraftUtils/colResizable-1.6.min';
import {useDispatch, useSelector} from "react-redux";
import './../../../styles/ConstructorStyles/GlobalDraftStyles.css'
import uniqid from "uniqid";
import {TableSelection} from './SelectionTableManager'
export const CREATED_TABLES={};
import { Map, Collection } from 'immutable'

import {
    DraftDefineSelectedTableCells,
    DraftNeedMergeTableCells,
    DraftNeedSplitTableCells
} from "../../../../redux/actions";
import {store} from "../../../../redux/StorageRedux";
import * as $ from "jquery";
import {getParsedTable, transposeMatrix} from "./GetParsedTableCheerIO";
import {MakeTableColResizable} from "./MakeTableColResizable";
import {createInitialTableState} from "./TableUtils";
import {TableEmbedCell} from "./TableEmbedCell";

TableSelection.initialize();





export const TableEmbedElement=(props)=>{
    const {block, contentState} = props;
    const {toggleEditorReadOnly}=props.blockProps;
    let {MergeSelectedCellsNeed,SplitSelectedCellsNeed,selectedTableCells}=useSelector((state)=>state.Draft);
    const {tableID} = contentState.getEntity(block.getEntityAt(0)).getData();
    const {rows, columns,CONFIG_TABLE_PARAMS}=CREATED_TABLES[tableID];
    let [SPAN_CELL_CONFIG, set_SPAN_CELL_CONFIG]=useState(()=>{
        let conf=[];
        for (let i=0; i<rows+1;i++){
            for (let j = 0; j <= columns+1; j++) {
                conf.push( ((j===0)||(j===columns+1) )
                    ?{colspan:1,rowspan:1, id: `${tableID}_BUFFER_CELL_${uniqid()}`,type:'BUFFER_0_WIDTH', startRowSpanNum:i, startColSpanNum:j}
                    :(i===0)?{colspan:1,rowspan:1, id: `${tableID}_BUFFER_CELL_${uniqid()}`,type:'BUFFER', startRowSpanNum:i, startColSpanNum:j}
                    :
                        {
                            colspan:1,rowspan:1,
                            id: `${tableID}_CELL_${uniqid()}`,
                            type:"CELL",
                            startRowSpanNum:i, startColSpanNum:j,
                            editorState: EditorState.createEmpty(),
                        })
            }
        }
        return conf;
    });
    const onChange =useCallback((editorState, id) =>
                                set_SPAN_CELL_CONFIG(
                                    (prevState)=>{return prevState.map((val)=>val.id===id?{...val, editorState:editorState}:val)}));


let dispatch= useDispatch();
let [isAllCellsReadOnly, setIsAllCellsReadOnly]=useState(false);
let isNeedUpdateMerge=useRef(false);
let isNeedUpdateSplit=useRef(false);

const ret = useMemo(()=>{
 let localret=[];
 let childrenForRowsNums=[];
     for (let ConfCell of SPAN_CELL_CONFIG){
         let {startRowSpanNum, startColSpanNum, type}=ConfCell;
         if (!Array.isArray(childrenForRowsNums[startRowSpanNum])){
             childrenForRowsNums[startRowSpanNum]=[];
         }
         childrenForRowsNums[startRowSpanNum].push(
             type==='CELL' ?<TableEmbedCell
                     isAllCellsReadOnly={isAllCellsReadOnly}
                     key={ConfCell.id} tableID={tableID}
                     CONFIG_TABLE_PARAMS={CONFIG_TABLE_PARAMS}
                     onChange={(editorState, id)=>onChange(editorState, id)}
                     ConfCell={ConfCell}/>
             :type==='BUFFER_0_WIDTH'? <td id={ConfCell.id} key={ConfCell.id} style={{minWidth: 0 + 'px',  width: CONFIG_TABLE_PARAMS.minCellWidth+'px'}}/>
             :<td  id={ConfCell.id} key={ConfCell.id} style={{minWidth: CONFIG_TABLE_PARAMS.minCellWidth + 'px'}}/>
         );
     }

     childrenForRowsNums.forEach((children, index)=>{
         localret.push(
             <tr key={`ROW_${index}`}>
                 {children}
             </tr>
         )
     });
    return localret
},[SPAN_CELL_CONFIG, isAllCellsReadOnly,CONFIG_TABLE_PARAMS, onChange]);

    useEffect(() => {MakeTableColResizable(tableID, CONFIG_TABLE_PARAMS)},[SPAN_CELL_CONFIG])
    useEffect(()=>{
        if (MergeSelectedCellsNeed && selectedTableCells.tableID===tableID && !isNeedUpdateMerge.current) {
            isNeedUpdateMerge.current=true;
           setTimeout(()=> dispatch(DraftNeedMergeTableCells(false)));
        }
    },
    [MergeSelectedCellsNeed]);

    useEffect(()=>{
            if (SplitSelectedCellsNeed && selectedTableCells.tableID===tableID && !isNeedUpdateSplit.current) {
                isNeedUpdateSplit.current=true;
                setTimeout(()=> dispatch(DraftNeedSplitTableCells(false)));
            }
        },
        [SplitSelectedCellsNeed]);

    useEffect(()=>{
        if (isNeedUpdateMerge.current){
            isNeedUpdateMerge.current=false;
            let idCellsToMerge= selectedTableCells.selectedCells.map(value => value.id);
            let ContentStatesBlockMapsToMerge=SPAN_CELL_CONFIG.filter((val)=>idCellsToMerge.includes(val.id)).map((val)=>val.editorState.getCurrentContent().getBlockMap());
            let resultBlockMapArray=ContentStatesBlockMapsToMerge[0].merge(...ContentStatesBlockMapsToMerge.slice(1)).toArray();
            let newContentState=ContentState.createFromBlockArray(resultBlockMapArray);
            let newEditorState=EditorState.createWithContent(newContentState);
            set_SPAN_CELL_CONFIG(
                (prevState)=>{return prevState.filter((val)=>!idCellsToMerge.slice(1).includes(val.id))
                    .map((val)=>val.id===idCellsToMerge[0]
                        ?{...val, editorState:newEditorState,colspan:selectedTableCells.colLengthSpan,rowspan:selectedTableCells.rowLengthSpan,}
                        :val)});
        }
    },[isNeedUpdateMerge.current])
    useEffect(()=>{
        if (isNeedUpdateSplit.current){
            isNeedUpdateSplit.current=false;
            let idCellToSplit= selectedTableCells.selectedCells[0].id;
            let parsedByCols=selectedTableCells.parsed;
            let parsedByRows=transposeMatrix(selectedTableCells.parsed);
            let ConfigSplitTableCell=useSelector((state)=>state.Draft.ConfigSplitTableCell);
            let {cols, rows}=ConfigSplitTableCell;

            let RowStartCell=parsedByRows.find((val)=>val.includes(idCellToSplit));
            let ColsCells=parsedByCols.filter((val)=>val.includes(idCellToSplit));

            let cellsInRowToExpand=RowStartCell.filter(val=>val!==idCellToSplit);
            let cellsInColumnsToExpand=ColsCells.flatMap((val)=>val.filter(v=>v!==idCellToSplit));
            let colsExpandUnit=ConfigSplitTableCell.cols/ColsCells.length;

            let ContentStateBlockMap=SPAN_CELL_CONFIG.find((val)=>idCellToSplit.includes(val.id)).editorState.getCurrentContent().getBlockMap();
            let newEditorState=EditorState.createWithContent(ContentStateBlockMap);

            set_SPAN_CELL_CONFIG(
                (prevState)=>{
                    return prevState
                    .filter((val)=>cellsInRowToExpand===val.id)
                    .map(val=>{return {...val,rowspan:val.rowspan+ConfigSplitTableCell.rows}})})
        }
    },[isNeedUpdateSplit.current])


return(
 <div
      onMouseDown={(e=>{setIsAllCellsReadOnly(true)})}
      onMouseUp={(e=>{setIsAllCellsReadOnly(false)})}
      onKeyUp={(e)=>e.stopPropagation()}
      onKeyDown={(e)=>{e.stopPropagation()}}
      onChange={(e)=>e.stopPropagation()}
      onFocus={()=>{toggleEditorReadOnly(true); console.log('focus')}}
      onBlur={()=>{toggleEditorReadOnly(false);console.log('blur' + performance.now())}}
      id={`TableContainer${tableID}`}
      style={{width: "100%", maxWidth:'100%',margin:'0'}}>
     <table className="table-selection"
            id={`${tableID}`}
            width="100%"
            border="0"
            cellPadding="0"
            cellSpacing="0"
            style={
                {   borderCollapse:'collapse',
                    border:`1px solid transparent`,
                    tableLayout: 'fixed'
                }}>
         <tbody>
             {ret}
         </tbody>
     </table>
 </div>
)
};



