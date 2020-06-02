import uniqid from "uniqid";
import {ContentState, EditorState} from "draft-js";
import {TableEmbedCell} from "./TableEmbedCell";
import React from "react";
import {transposeMatrix} from "./GetParsedTableCheerIO";


export const TABLE_CELL_TYPES={
    buffer0:'_BUFFER_NULL_WIDTH_',
    standard:'_CELL_',
};
export function diff(a1, a2) {
    return a1.filter(i=>a2.indexOf(i)<0)
        .concat(a2.filter(i=>a1.indexOf(i)<0))
}
export function compareArraysDeep(a1, a2) {
    return a1.length === a2.length && a1.every((v,i)=> Array.isArray(v)?compareArraysDeep(v,a2[i]):v === a2[i])
}
export function includesArrayOneOfMany(arr, ...els) {
    let res=els.filter(el=>arr.includes(el));
    return res.length!==0;
}
export function includesArrayAllOfMany(arr, ...els) {
    let res=els.filter(el=>arr.includes(el));
    return res.length===els.length;
}
export function filterObjectByKeys(obj, checkCallback) {
    return Object.fromEntries(Object.entries(obj).filter(entry=>checkCallback(entry[0])))
}
export function getTableByCellId(cellID) {
    let cell=$('#'+cellID)[0];
    return cell ? cell.closest('table'): undefined;
}
export function getLastArrEl(arr) {
    return arr[arr.length-1];
}
export function findLastInArr(arr,elCallback) {
    let filtered=arr.filter(el=>elCallback(el));
    if (filtered.length===0)
        return undefined;
    return getLastArrEl(filtered);
}
export function getNextArrEl(arr, cur) {
    return arr[arr.indexOf(cur)+1];
}
export function insertInInxArr(arr, el, inx) {
    return arr.slice(0,inx).concat([el]).concat(arr.slice(inx));
}
export function deleteFromInxArr(arr, el, inx) {
    return arr.slice(0,inx).concat(arr.slice(inx+1));
}

export const createInitialLayoutTable = (rows, columns, tableID) => {
    let layoutCols = [];
    let IdEditorStates={}
    for (let i = 0; i <= columns + 1; i++) {
        layoutCols.push([]);
        for (let j = 0; j < rows; j++) {
            if ((i === 0 || i === (columns + 1))){
                layoutCols[i].push(uniqid(TABLE_CELL_TYPES.buffer0+tableID))
            }
            else {
                let id=uniqid(TABLE_CELL_TYPES.standard+tableID);
                layoutCols[i].push(id)
                IdEditorStates[id]=EditorState.createEmpty();
            }
        }
    }
    return {layoutCols,IdEditorStates};
};
export const getColSpanById=(id, parsedCols)=>parsedCols.filter((val)=>val.includes(id)).length;
export const getRowSpanById=(id, parsedRows)=>parsedRows.filter((val)=>val.includes(id)).length;

let cashedResultRowsTableParserByLayout=undefined;
export const tableParserByLayout=(layoutCols,IdEditorStates,isAllCellsReadOnly,tableID,CONFIG_TABLE_PARAMS,onChange, LastUpdateId_OPTIONAL)=>{
    //console.log('перед кэшированием' +performance.now())
    let layoutRows=transposeMatrix(layoutCols);
    let resultRows=[];
    //////////////////
    if (LastUpdateId_OPTIONAL){
        resultRows=cashedResultRowsTableParserByLayout.map(row=>row.map(cell=>cell.key===LastUpdateId_OPTIONAL?
            <TableEmbedCell
                {...cell.props}
                editorState={IdEditorStates[LastUpdateId_OPTIONAL]}
                key={LastUpdateId_OPTIONAL}
            />
            :cell));

        //console.log('после кэшированием'+performance.now())
        return resultRows.map((rowEls,index)=><tr key={index}>{rowEls}</tr>)
    }
    /////////////////
    let isAlreadyCalculatedIDs=[];
    layoutRows.forEach((row,rowInx)=>{
        let cellsForRow=[];
        row.forEach((cellID,colInx)=>{
            if (!isAlreadyCalculatedIDs.includes(cellID)){
                isAlreadyCalculatedIDs.push(cellID);
                cellsForRow.push(
                    cellID.startsWith(TABLE_CELL_TYPES.standard)
                        ?<TableEmbedCell
                            isAllCellsReadOnly={isAllCellsReadOnly}
                            key={cellID} tableID={tableID}
                            CONFIG_TABLE_PARAMS={CONFIG_TABLE_PARAMS}
                            onChange={(editorState, id)=>onChange(editorState, id)}
                            colInx={colInx}
                            rowInx={rowInx}
                            id={cellID}
                            editorState={IdEditorStates[cellID]}
                            colspan={getColSpanById(cellID,layoutCols)}
                            rowspan={getRowSpanById(cellID,layoutRows)}/>
                        :<td rowSpan={getRowSpanById(cellID,layoutRows)} id={cellID} key={cellID} style={{minWidth: 0 + 'px',  width: CONFIG_TABLE_PARAMS.minCellWidth+'px'}}/>
                )
            }
        });
        if (cellsForRow.length>0){
            resultRows.push(cellsForRow);
        }
    });
    ///////////
    cashedResultRowsTableParserByLayout=resultRows;
    ///////////
    //console.log('после кэшированием'+performance.now())

    return resultRows.map((rowEls,index)=><tr key={index}>{rowEls}</tr>);
};
export const getMergedTableCellsState=(selectedTableCells,LAYOUT_AND_EDITORS)=>{
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let idCellsToMerge = selectedTableCells.selectedCells.map(value => value.id).filter(id => !id.startsWith(TABLE_CELL_TYPES.buffer0));
        let ContentStatesBlockMapsToMerge = idCellsToMerge.map((val) => IdEditorStates[val].getCurrentContent().getBlockMap());


        let resultBlockMapArray = ContentStatesBlockMapsToMerge[0].merge(...ContentStatesBlockMapsToMerge.slice(1)).toArray();
        let newContentState = ContentState.createFromBlockArray(resultBlockMapArray);
        let newEditorState = EditorState.createWithContent(newContentState);
        let cellsToErase = idCellsToMerge.slice(1);
        IdEditorStates = Object.fromEntries(Object.entries(IdEditorStates).filter(entry => !cellsToErase.includes(entry[0])));


        IdEditorStates[idCellsToMerge[0]] = newEditorState;
        layoutCols = layoutCols.map(col => col.map(cell => cellsToErase.includes(cell) ? idCellsToMerge[0] : cell));

        ///избежание большого роуспана против глюков
        let layoutRows = transposeMatrix(layoutCols);
        let doublers = [];
        for (let i = 1; i < layoutRows.length; i++) {
            if (compareArraysDeep(layoutRows[i], layoutRows[i - 1])) {
                doublers.push(layoutRows[i]);
            }
        }
        layoutRows = layoutRows.filter(row => !doublers.includes(row));
        layoutCols = transposeMatrix(layoutRows);
        ///////////////////////////////
        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e)
        return LAYOUT_AND_EDITORS;//при ошибке ниче не менять
    }
};
export const getSplittedTableCellsState = (selectedTableCells, LAYOUT_AND_EDITORS, ConfigSplitTableCell, tableID) => {
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let parsedByCols = layoutCols;
        let parsedByRows = transposeMatrix(layoutCols);
        let {cols, rows} = ConfigSplitTableCell;
        let idCellToSplit = selectedTableCells.selectedCells[0].id;

        let curColSpan = getColSpanById(idCellToSplit, parsedByCols);
        let curRowSpan = getColSpanById(idCellToSplit, parsedByRows);

        let newCellsIDs = [];
        for (let i = 0; i < (cols); i++) {
            newCellsIDs.push([])
            for (let j = 0; j < rows; j++) {
                let id = uniqid(TABLE_CELL_TYPES.standard + tableID);
                newCellsIDs[i].push(id)
                IdEditorStates[id] = EditorState.createEmpty();
            }
        }
        newCellsIDs[0][0] = idCellToSplit;

        let multCols = cols / curColSpan;
        let multRows = rows / curRowSpan;

        if (cols > curColSpan) {
            parsedByCols = parsedByCols.flatMap(col => col.includes(idCellToSplit) ? (new Array(multCols).fill(col)) : [col]);
        }
        if (rows > curRowSpan) {
            parsedByRows = transposeMatrix(parsedByCols).flatMap(row => row.includes(idCellToSplit) ? (new Array(multRows).fill(row)) : [row]);
            parsedByCols = transposeMatrix(parsedByRows);
        }

        let RowStart = parsedByRows.find((val) => val.includes(idCellToSplit));
        let ColStart = parsedByCols.find((val) => val.includes(idCellToSplit));

        let RowStartInx = parsedByRows.indexOf(RowStart);
        let ColStartInx = parsedByCols.indexOf(ColStart);

        let newColSpanEvery = getColSpanById(idCellToSplit, parsedByCols) / cols;
        let newRowSpanEvery = getRowSpanById(idCellToSplit, parsedByRows) / rows;

        layoutCols = parsedByCols.map((col, colInx) => col.map((cell, cellInx) =>
            cell === idCellToSplit ? newCellsIDs[Math.floor((colInx - ColStartInx) / newColSpanEvery)][Math.floor((cellInx - RowStartInx) / newRowSpanEvery)] : cell));

        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e)
        return LAYOUT_AND_EDITORS
    }
};
export const getTableCellsStateDeleteRowsPartialSelection = (selectedTableCells, LAYOUT_AND_EDITORS) => {
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let parsedByRows = transposeMatrix(layoutCols);
        let selectedCellsID = selectedTableCells.selectedCells.map(cell => cell.id);

        let rowsToDelete = parsedByRows.filter(row => includesArrayOneOfMany(row, ...selectedCellsID));
        parsedByRows = parsedByRows.filter(row => !rowsToDelete.includes(row));
        layoutCols = transposeMatrix(parsedByRows);
        IdEditorStates = filterObjectByKeys(IdEditorStates, (key) => !selectedCellsID.includes(key));

        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e);
        return LAYOUT_AND_EDITORS;
    }
};
export const getTableCellsStateDeleteRowsFullSelection = (selectedTableCells, LAYOUT_AND_EDITORS) => {
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let parsedByRows = transposeMatrix(layoutCols);
        let selectedCellsID = selectedTableCells.selectedCells.map(cell => cell.id).filter(id=>!id.startsWith(TABLE_CELL_TYPES.buffer0));
        let rowsToDelete = parsedByRows.filter(row =>includesArrayAllOfMany(selectedCellsID,...row.filter(id=>!id.startsWith(TABLE_CELL_TYPES.buffer0))));
        if (rowsToDelete.length===0){
            return LAYOUT_AND_EDITORS;
        }

        parsedByRows = parsedByRows.filter(row => !rowsToDelete.includes(row));
        layoutCols = transposeMatrix(parsedByRows);
        IdEditorStates = filterObjectByKeys(IdEditorStates, (key) => !selectedCellsID.includes(key));
        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e);
        return LAYOUT_AND_EDITORS;
    }
};
export const getTableCellsStateDeleteColumnsPartialSelection = (selectedTableCells, LAYOUT_AND_EDITORS) => {
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let selectedCellsID = selectedTableCells.selectedCells.map(cell => cell.id);
        let colsToDelete = layoutCols.filter(col => includesArrayOneOfMany(col, ...selectedCellsID));
        layoutCols = layoutCols.filter(col => !colsToDelete.includes(col));
        IdEditorStates = filterObjectByKeys(IdEditorStates, (key) => !selectedCellsID.includes(key));
        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e);
        return LAYOUT_AND_EDITORS;
    }
};
export const getTableCellsStateDeleteColumnsFullSelection = (selectedTableCells, LAYOUT_AND_EDITORS) => {
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let selectedCellsID = selectedTableCells.selectedCells.map(cell => cell.id).filter(id=>!id.startsWith(TABLE_CELL_TYPES.buffer0));
        let colsToDelete = layoutCols.filter(col =>includesArrayAllOfMany(selectedCellsID,...col));
        if (colsToDelete.length===0){
            return LAYOUT_AND_EDITORS;
        }
        layoutCols = layoutCols.filter(col => !colsToDelete.includes(col));
        IdEditorStates = filterObjectByKeys(IdEditorStates, (key) => !selectedCellsID.includes(key));
        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e);
        return LAYOUT_AND_EDITORS;
    }
};
export const getTableCellsStateInsertedCol=(idFirstCellInColAfterToIns, LAYOUT_AND_EDITORS,tableID)=>{
    try {
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let inxBeforeNewCol=layoutCols.indexOf(findLastInArr(layoutCols, (col)=>col.includes(idFirstCellInColAfterToIns)));
        let newEmptyColToInsert=[];
        for (let i=0;i<layoutCols[inxBeforeNewCol].length;i++){
            let id=uniqid(TABLE_CELL_TYPES.standard+tableID);
            newEmptyColToInsert.push(id)
            IdEditorStates[id]=EditorState.createEmpty();
        }
        layoutCols=insertInInxArr(layoutCols, newEmptyColToInsert, inxBeforeNewCol+1);

        return {layoutCols, IdEditorStates}
    } catch (e) {
        console.log(e);
        return LAYOUT_AND_EDITORS;
    }
};
export const getTableCellsStateInsertedRow=(idFirstCellInRowAfterToIns, LAYOUT_AND_EDITORS,tableID)=>{
   /* try {*/
        let {layoutCols, IdEditorStates} = LAYOUT_AND_EDITORS;
        let parsedRows=transposeMatrix(layoutCols);
        let inxBeforeNewRow=parsedRows.indexOf(findLastInArr(parsedRows, (row)=>row.includes(idFirstCellInRowAfterToIns)));
        let newEmptyRowToInsert=[];
        for (let i=0;i<parsedRows[inxBeforeNewRow].length;i++){
            if (i===0 || i===(parsedRows[inxBeforeNewRow].length-1)){
                newEmptyRowToInsert.push(uniqid(TABLE_CELL_TYPES.buffer0+tableID))
            }
            else {
                let id=uniqid(TABLE_CELL_TYPES.standard+tableID);
                newEmptyRowToInsert.push(id)
                IdEditorStates[id]=EditorState.createEmpty();
            }
        }
        layoutCols=transposeMatrix(insertInInxArr(parsedRows, newEmptyRowToInsert, inxBeforeNewRow+1));
        return {layoutCols, IdEditorStates}
    /*} catch (e) {
        console.warn(e);
        return LAYOUT_AND_EDITORS;
    }*/
};