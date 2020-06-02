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
    DraftDefineSelectedTableCells, DraftInsertColumnTable, DraftInsertRowTable, DraftNeedDeleteColumnsWithFULLSelection,
    DraftNeedDeleteColumnsWithSelection,
    DraftNeedDeleteRowsWithFULLSelection,
    DraftNeedDeleteRowsWithSelection,
    DraftNeedMergeTableCells,
    DraftNeedSplitTableCells
} from "../../../../redux/actions";
import {store} from "../../../../redux/StorageRedux";
import * as $ from "jquery";
import {getParsedTable, transposeMatrix} from "./GetParsedTableCheerIO";
import {MakeTableColResizable} from "./MakeTableColResizable";
import {
    createInitialLayoutTable,
    createInitialTableState,
    getMergedTableCellsState,
    getSplittedTableCellsState, getTableByCellId,
    getTableCellsStateDeleteColumnsFullSelection,
    getTableCellsStateDeleteColumnsPartialSelection,
    getTableCellsStateDeleteRowsFullSelection,
    getTableCellsStateDeleteRowsPartialSelection, getTableCellsStateInsertedCol, getTableCellsStateInsertedRow,
    tableParserByLayout
} from "./TableUtils";
import {
    setCurRowSelectionEndId,
    TableEmbedCell,
    setCurRowSelectionStartId,
    setCurColSelectionStartId, setCurColSelectionEndId
} from "./TableEmbedCell";

TableSelection.initialize();





export const TableEmbedElement=(props)=>{
    const {block, contentState} = props;
    const {toggleEditorReadOnly}=props.blockProps;
    let {MergeSelectedCellsNeed,SplitSelectedCellsNeed,selectedTableCells, ConfigSplitTableCell,
        NeedDeleteRowsWithSelection, NeedDeleteColumnsWithSelection, NeedDeleteRowsWithFULLSelection,
        NeedDeleteColumnsWithFULLSelection,IdFirstColCellToInsertTable,IdFirstRowCellToInsertTable}=useSelector((state)=>state.Draft);
    const {tableID} = contentState.getEntity(block.getEntityAt(0)).getData();
    const {rows, columns,CONFIG_TABLE_PARAMS}=CREATED_TABLES[tableID];
    let [LAYOUT_AND_EDITORS, set_LAYOUT_AND_EDITORS]=useState(createInitialLayoutTable(rows,columns,tableID));
    const onChange =useCallback((editorState, id) => set_LAYOUT_AND_EDITORS(
                                    (prevState)=>{reasonIDofLastUpdate.current=id;return {layoutCols:prevState.layoutCols,IdEditorStates:{...prevState.IdEditorStates,[id]:editorState}}}));


    let dispatch= useDispatch();
    let [isAllCellsReadOnly, setIsAllCellsReadOnly]=useState(false);
    let isNeedUpdateMerge=useRef(false);
    let isNeedUpdateSplit=useRef(false);
    let isNeedDeleteRowsWithPartSel=useRef(false);
    let isNeedDeleteRowsWithFULLSel=useRef(false);
    let isNeedDeleteColsWithPartSel=useRef(false);
    let isNeedDeleteColsWithFULLSel=useRef(false);

    let LOCAL_IdFirstColCellToInsertTable=useRef(undefined);
    let LOCAL_IdFirstRowCellToInsertTable=useRef(undefined);


    let reasonIDofLastUpdate=useRef(undefined);


    const ret = useMemo(() => {
        let localret=tableParserByLayout(LAYOUT_AND_EDITORS.layoutCols, LAYOUT_AND_EDITORS.IdEditorStates, isAllCellsReadOnly, tableID, CONFIG_TABLE_PARAMS, onChange, reasonIDofLastUpdate.current)
        reasonIDofLastUpdate.current=undefined;
        return localret;
    }, [LAYOUT_AND_EDITORS,reasonIDofLastUpdate, isAllCellsReadOnly, CONFIG_TABLE_PARAMS]);

    useEffect(() => {
        MakeTableColResizable(tableID);
    },[LAYOUT_AND_EDITORS])
    useEffect(()=>{
        if (MergeSelectedCellsNeed && selectedTableCells.tableID===tableID && !isNeedUpdateMerge.current) {
            isNeedUpdateMerge.current=true;
           setTimeout(()=> dispatch(DraftNeedMergeTableCells(false)));
        }
    }, [MergeSelectedCellsNeed]);
    useEffect(()=>{
            if (SplitSelectedCellsNeed && selectedTableCells.tableID===tableID && !isNeedUpdateSplit.current) {
                isNeedUpdateSplit.current=true;
                setTimeout(()=> dispatch(DraftNeedSplitTableCells(false)));
            }
        }, [SplitSelectedCellsNeed]);
    useEffect(()=>{
        if (NeedDeleteRowsWithSelection && selectedTableCells.tableID===tableID && !isNeedDeleteRowsWithPartSel.current) {
            isNeedDeleteRowsWithPartSel.current=true;
            setTimeout(()=> dispatch(DraftNeedDeleteRowsWithSelection(false)));
        }
    }, [NeedDeleteRowsWithSelection]);
    useEffect(()=>{
        if (NeedDeleteRowsWithFULLSelection && selectedTableCells.tableID===tableID && !isNeedDeleteRowsWithFULLSel.current) {
            isNeedDeleteRowsWithFULLSel.current=true;
            setTimeout(()=> dispatch(DraftNeedDeleteRowsWithFULLSelection(false)));
        }
    }, [NeedDeleteRowsWithFULLSelection]);
    useEffect(()=>{
        if (NeedDeleteColumnsWithSelection && selectedTableCells.tableID===tableID && !isNeedDeleteColsWithPartSel.current) {
            isNeedDeleteColsWithPartSel.current=true;
            setTimeout(()=> dispatch(DraftNeedDeleteColumnsWithSelection(false)));
        }
    }, [NeedDeleteColumnsWithSelection]);
    useEffect(()=>{
        if (NeedDeleteColumnsWithFULLSelection && selectedTableCells.tableID===tableID && !isNeedDeleteColsWithFULLSel.current) {
            isNeedDeleteColsWithFULLSel.current=true;
            setTimeout(()=> dispatch(DraftNeedDeleteColumnsWithFULLSelection(false)));
        }
    }, [NeedDeleteColumnsWithFULLSelection]);
    useEffect(()=>{
        if (IdFirstColCellToInsertTable && getTableByCellId(IdFirstColCellToInsertTable) && getTableByCellId(IdFirstColCellToInsertTable).id===tableID && !LOCAL_IdFirstColCellToInsertTable.current) {
            LOCAL_IdFirstColCellToInsertTable.current=IdFirstColCellToInsertTable;
            setTimeout(()=> dispatch(DraftInsertColumnTable(undefined)));
        }
    }, [IdFirstColCellToInsertTable]);
   /* useEffect(()=>{
        if (IdFirstRowCellToInsertTable && getTableByCellId(IdFirstRowCellToInsertTable) && getTableByCellId(IdFirstRowCellToInsertTable).id===tableID && !LOCAL_IdFirstRowCellToInsertTable.current) {
            LOCAL_IdFirstRowCellToInsertTable.current=IdFirstRowCellToInsertTable;
            setTimeout(()=> dispatch(DraftInsertRowTable(undefined)));
        }
    }, [IdFirstRowCellToInsertTable]);*/
    useEffect(()=>{
        let table=getTableByCellId(IdFirstRowCellToInsertTable);
        if (IdFirstRowCellToInsertTable && table && table.id===tableID) {
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateInsertedRow(IdFirstRowCellToInsertTable, prev, tableID));
            dispatch(DraftInsertRowTable(undefined));
        }
    }, [IdFirstRowCellToInsertTable]);
    useEffect(()=>{
        if (isNeedUpdateMerge.current){
            isNeedUpdateMerge.current=false;
            set_LAYOUT_AND_EDITORS((prev)=>getMergedTableCellsState(selectedTableCells,prev));
        }
    },[isNeedUpdateMerge.current])
    useEffect(()=>{
        if (isNeedUpdateSplit.current){
            isNeedUpdateSplit.current=false;
            set_LAYOUT_AND_EDITORS((prev)=>getSplittedTableCellsState(selectedTableCells,prev,ConfigSplitTableCell,tableID));
        }
    },[isNeedUpdateSplit.current])
    useEffect(()=>{
        if (isNeedDeleteRowsWithPartSel.current){
            isNeedDeleteRowsWithPartSel.current=false;
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteRowsPartialSelection(selectedTableCells,prev));
        }
    },[isNeedDeleteRowsWithPartSel.current])
    useEffect(()=>{
        if (isNeedDeleteRowsWithFULLSel.current){
            isNeedDeleteRowsWithFULLSel.current=false;
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteRowsFullSelection(selectedTableCells,prev));
        }
    },[isNeedDeleteRowsWithFULLSel.current])
    useEffect(()=>{
        if (isNeedDeleteColsWithPartSel.current){
            isNeedDeleteColsWithPartSel.current=false;
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteColumnsPartialSelection(selectedTableCells,prev));
        }
    },[isNeedDeleteColsWithPartSel.current])
    useEffect(()=>{
        if (isNeedDeleteColsWithFULLSel.current){
            isNeedDeleteColsWithFULLSel.current=false;
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteColumnsFullSelection(selectedTableCells,prev));
        }
    },[isNeedDeleteColsWithFULLSel.current])
    useEffect(()=>{
        if (LOCAL_IdFirstColCellToInsertTable.current){
            let needId=LOCAL_IdFirstColCellToInsertTable.current;
            LOCAL_IdFirstColCellToInsertTable.current=undefined;
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateInsertedCol(needId, prev, tableID));

        }
    },[LOCAL_IdFirstColCellToInsertTable.current])
    useEffect(()=>{
        if (LOCAL_IdFirstRowCellToInsertTable.current){
            let needId=LOCAL_IdFirstRowCellToInsertTable.current;
            LOCAL_IdFirstRowCellToInsertTable.current=undefined;
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateInsertedRow(needId, prev, tableID));

        }
    },[LOCAL_IdFirstRowCellToInsertTable.current])

    return(
 <div
      onMouseDown={(e=>{setIsAllCellsReadOnly(true)})}
      onMouseUp={(e=>{
          setIsAllCellsReadOnly(false);
          setCurRowSelectionEndId(undefined);
          setCurRowSelectionStartId(undefined);
          setCurColSelectionStartId(undefined);
          setCurColSelectionEndId(undefined);
      })}
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



