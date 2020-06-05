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
import './../../../styles/CommonStyles/commonstyles.css'


TableSelection.initialize('.tableSelection','tableSelectedCell');





export const TableEmbedElement=(props)=>{
    const {block, contentState} = props;
    const {toggleEditorReadOnly,onChangeParent}=props.blockProps;
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

    let reasonIDofLastUpdate=useRef(undefined);


    const ret = useMemo(() => {
        CREATED_TABLES[tableID].LAYOUT_AND_EDITORS=LAYOUT_AND_EDITORS;
        let localret=tableParserByLayout(LAYOUT_AND_EDITORS.layoutCols, LAYOUT_AND_EDITORS.IdEditorStates, isAllCellsReadOnly, tableID, CONFIG_TABLE_PARAMS, onChange, reasonIDofLastUpdate.current)
        reasonIDofLastUpdate.current=undefined;
        return localret;
    }, [LAYOUT_AND_EDITORS,reasonIDofLastUpdate, isAllCellsReadOnly, CONFIG_TABLE_PARAMS]);

    useEffect(() => {
        MakeTableColResizable(tableID);
    },[LAYOUT_AND_EDITORS])
    useEffect(()=>{
        if (MergeSelectedCellsNeed && selectedTableCells && selectedTableCells.tableID===tableID ) {
           set_LAYOUT_AND_EDITORS((prev)=>getMergedTableCellsState(selectedTableCells,prev));
           dispatch(DraftNeedMergeTableCells(false));
        }
    }, [MergeSelectedCellsNeed]);
    useEffect(()=>{
            if (SplitSelectedCellsNeed && selectedTableCells && selectedTableCells.tableID===tableID) {
                set_LAYOUT_AND_EDITORS((prev)=>getSplittedTableCellsState(selectedTableCells,prev,ConfigSplitTableCell,tableID));
                dispatch(DraftNeedSplitTableCells(false));
            }
        }, [SplitSelectedCellsNeed]);
    useEffect(()=>{
        if (NeedDeleteRowsWithSelection && selectedTableCells && selectedTableCells.tableID===tableID) {
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteRowsPartialSelection(selectedTableCells,prev));
            dispatch(DraftNeedDeleteRowsWithSelection(false));
        }
    }, [NeedDeleteRowsWithSelection]);
    useEffect(()=>{
        if (NeedDeleteRowsWithFULLSelection && selectedTableCells && selectedTableCells.tableID===tableID) {
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteRowsFullSelection(selectedTableCells,prev));
            dispatch(DraftNeedDeleteRowsWithFULLSelection(false));
        }
    }, [NeedDeleteRowsWithFULLSelection]);
    useEffect(()=>{
        if (NeedDeleteColumnsWithSelection && selectedTableCells && selectedTableCells.tableID===tableID) {
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteColumnsPartialSelection(selectedTableCells,prev));
            dispatch(DraftNeedDeleteColumnsWithSelection(false));
        }
    }, [NeedDeleteColumnsWithSelection]);
    useEffect(()=>{
        if (NeedDeleteColumnsWithFULLSelection && selectedTableCells && selectedTableCells.tableID===tableID) {
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateDeleteColumnsFullSelection(selectedTableCells,prev));
            dispatch(DraftNeedDeleteColumnsWithFULLSelection(false));
        }
    }, [NeedDeleteColumnsWithFULLSelection]);
    useEffect(()=>{
        let table=getTableByCellId(IdFirstColCellToInsertTable);
        if (IdFirstColCellToInsertTable && table && table.id===tableID) {
           set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateInsertedCol(IdFirstColCellToInsertTable, prev, tableID));
           dispatch(DraftInsertColumnTable(undefined));
        }
    }, [IdFirstColCellToInsertTable]);
    useEffect(()=>{
        let table=getTableByCellId(IdFirstRowCellToInsertTable);
        if (IdFirstRowCellToInsertTable && table && table.id===tableID) {
            set_LAYOUT_AND_EDITORS((prev)=>getTableCellsStateInsertedRow(IdFirstRowCellToInsertTable, prev, tableID));
            dispatch(DraftInsertRowTable(undefined));
        }
    }, [IdFirstRowCellToInsertTable]);


    return(
 <div
      onMouseDown={(e=>{toggleEditorReadOnly(true);setIsAllCellsReadOnly(true)})}
      onMouseUp={(e=>{
          toggleEditorReadOnly(true);
          setIsAllCellsReadOnly(false);
          setCurRowSelectionEndId(undefined);
          setCurRowSelectionStartId(undefined);
          setCurColSelectionStartId(undefined);
          setCurColSelectionEndId(undefined);
          e.stopPropagation();/* e.preventDefault();*/
      })}
      onKeyUp={(e)=>{e.stopPropagation()}}
      onKeyDown={(e)=>{e.stopPropagation()}}
      onFocus={(e)=>{toggleEditorReadOnly(true);e.stopPropagation(); /*e.preventDefault()*/}}
      onSelect={(e)=>{ e.stopPropagation(); /*e.preventDefault()*/}}
      onBlur={()=>{toggleEditorReadOnly(false);}}
      id={`TableContainer${tableID}`}

      style={{width: "100%", maxWidth:'100%',margin:'0'}}>
     <table className="tableSelection"
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



