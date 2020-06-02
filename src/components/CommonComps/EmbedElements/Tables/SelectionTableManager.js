/////////////////////////////////////////начало куска чужого кода c моими правками
/*!
 * TableSelection library v0.9.1 (https://github.com/WouterWidgets/table-selection)
 * Copyright (c) 2018 Wouter Smit
 * Licensed under MIT (https://github.com/WouterWidgets/table-selection/blob/master/LICENSE)
*/
import {DraftDefineSelectedTableCells, DraftSelectTableColumn, DraftSelectTableRow} from "../../../../redux/actions";
import {store} from "../../../../redux/StorageRedux";
import cheerio from 'cheerio';
import cheerioTableparser from 'cheerio-tableparser';
import {getParsedTable, transposeMatrix} from "./GetParsedTableCheerIO";
import {TABLE_CELL_TYPES} from "./TableUtils";

function handleChangeSelection() {
    let {SelectedTableRowSFirstCellIdS,SelectedTableColumnFirstCellId} = (store.getState()).Draft;

    if (SelectedTableRowSFirstCellIdS) {
        let startTd=document.getElementById(SelectedTableRowSFirstCellIdS[0]);
        let table=startTd.closest('table');
        let parsed=getParsedTable(table);

        let rowParsed=transposeMatrix(parsed);
        let needRowStart=rowParsed.find((row)=>row.includes(SelectedTableRowSFirstCellIdS[0]));
        let needRowEnd=rowParsed.find((row)=>row.includes(SelectedTableRowSFirstCellIdS[1]));

        let endTd=document.getElementById(needRowEnd[needRowEnd.length-1]);
        if(endTd.closest('table')===table){
            if (rowParsed.indexOf(needRowStart) > (rowParsed.indexOf(needRowEnd) )) {
                let buf=startTd;
                startTd=endTd;
                endTd=buf;
            }
            let windowSel=window.getSelection();
            let rng=document.createRange();
            rng.setStart(startTd,0);
            rng.setEnd(endTd,0);
            windowSel.removeAllRanges();
            windowSel.addRange(rng);
        }
        store.dispatch(DraftSelectTableRow(undefined));
    }
    if (SelectedTableColumnFirstCellId) {
        let startTd=document.getElementById(SelectedTableColumnFirstCellId[0]);
        let table=startTd.closest('table');
        let parsed=getParsedTable(table);

        let needColStart=parsed.find((col)=>col.includes(SelectedTableColumnFirstCellId[0]));
        let needColEnd=parsed.find((col)=>col.includes(SelectedTableColumnFirstCellId[1]));

        let endTd=document.getElementById(needColEnd[needColEnd.length-1]);


        if(endTd.closest('table')===table){
            if (parsed.indexOf(needColStart) > (parsed.indexOf(needColEnd) )) {
                startTd=document.getElementById(needColEnd[0]);;
                endTd=document.getElementById(needColStart[needColStart.length-1]);;
            }
            let windowSel=window.getSelection();
            let rng=document.createRange();
            console.log(startTd)
            console.log(endTd)
            rng.setStart(startTd,0);
            rng.setEnd(endTd,0);
            windowSel.removeAllRanges();
            windowSel.addRange(rng);
        }

        store.dispatch(DraftSelectTableColumn(undefined));
    }
}
export class TableSelection {

    constructor(selector = '.table-selection', selectedClass = 'selected') {
        this.selector = selector;
        this.selectedClass = selectedClass;

        this.selection = null;
        this.nativeSelection = null;
        this.setEventHandlers();


        store.subscribe(handleChangeSelection)

    }

    static initialize(selector = '.table-selection', selectedClass = 'selected') {
        new TableSelection(selector, selectedClass);
    }

    setEventHandlers() {
        document.addEventListener('selectionchange', this.selectionChangeHandler.bind(this));
        document.addEventListener('copy', this.copyHandler.bind(this));
    }

    selectionChangeHandler() {

        let windowSel=window.getSelection();
        if (!(windowSel && windowSel.anchorNode && windowSel.anchorNode.parentNode && windowSel.anchorNode.parentNode.closest('#RichEditoreditor_'))){
           return;
       };

        this.deselect();
        this.nativeSelection = window.getSelection ? getSelection() : null;

        if (!this.nativeSelection) {
            return;
        }

        this.getSelection();
        this.showSelection();
    }

    getSelection() {
        const tds = this.getSelectionTds();

        if (!tds || !tds.start.closest(this.selector)) {
            return;
        }

        const trs = this.getSelectionTrs(tds);

        this.selection = {
            tds: tds,
            trs: trs,
        };

        this.selection.cells = this.getCellsInSelectionRange(this.selection);

        return this.selection;
    }

    getCellsInSelectionRange(selection) {
        const tdStart = selection.tds.start;
        const tdEnd = selection.tds.end;

        let table=tdStart.closest('table');
        let parsed=getParsedTable(table);

        let colWithStart=parsed.find((col)=>col.includes(tdStart.id));
        let x=parsed.filter((col)=>col.includes(tdEnd.id));
        let colWithEnd=x[x.length-1];

        let rowSpanStart=colWithStart.indexOf(tdStart.id);
        let rowSpanEnd=colWithEnd.lastIndexOf(tdEnd.id);

        let colSpanStart=parsed.indexOf(colWithStart);
        let colSpanEnd=parsed.indexOf(colWithEnd);

        let cells=[];

        parsed.forEach((col, indexCol)=>{
            col.forEach((cell, indexCell)=>{
                if ((indexCol>=Math.min(colSpanStart, colSpanEnd) && indexCol<=Math.max(colSpanStart, colSpanEnd))
                    && (indexCell>=Math.min(rowSpanStart, rowSpanEnd) && indexCell<=Math.max(rowSpanStart, rowSpanEnd))){
                    cells.push(cell)
                }
            })
        });
        cells=Array.from(new Set(cells)).map((cellId)=>document.getElementById(cellId));

        store.dispatch(DraftDefineSelectedTableCells(
            {selectedCells: cells, tableID: tdStart.closest('table').id,
                colSpanStartInx:colSpanStart, colSpanEndInx:colSpanEnd,colLengthSpan: Math.abs(colSpanEnd-colSpanStart)+1,
                rowSpanStartInx:rowSpanStart, rowLengthSpan:Math.abs(rowSpanEnd-rowSpanStart)+1, parsed}));

/////////////////////////////////
        return cells;
    }
    getSelectionTds() {
        let start = this.nativeSelection.anchorNode;
        let end = this.nativeSelection.focusNode;

        if (!start || !end) {
            return;
        }

        if (start.nodeType !== 1) {
            start = start.parentElement;
        }

        if (end.nodeType !== 1) {
            end = end.parentElement;
        }

        start = start.closest('td');
        end = end.closest('td');

        if (!start || !end) {
            return;
        }

        if (start.cellIndex > end.cellIndex) {
            [end, start] = [start, end];
        }

        return {start, end}
    }

    getSelectionTrs(tds) {
        if (!tds.start || !tds.end) {
            return;
        }

        let start = tds.start.closest('tr');
        let end = tds.end.closest('tr');

        if (start.rowIndex > end.rowIndex) {
            [end, start] = [start, end];
        }

        return {start, end}
    }

    showSelection() {
        this.selection && this.selection.cells.forEach(cell => {
            cell.classList.add(this.selectedClass);
        });
    }

    hideSelection() {
        this.selection && this.selection.cells.forEach(cell => {
            cell.classList.remove(this.selectedClass);
        });
    }

    deselect() {
        if (!this.selection) {
            return;
        }
        store.dispatch(DraftDefineSelectedTableCells(undefined));
        this.hideSelection();
        this.selection = null;
        this.nativeSelection = null;
    }

    getSelectionText() {
        let rowData = {},
            data = [];

        this.selection.cells.forEach(cell => {
            const rowIndex = cell.parentElement.rowIndex;
            rowData[rowIndex] = rowData[rowIndex] || [];
            rowData[rowIndex].push(cell.innerText);
        });

        for (const i in rowData) {
            if (!rowData.hasOwnProperty(i)) {
                continue;
            }
            data.push(rowData[i].join("\t"));
        }

        return data.join("\n");
    }

    copyHandler(e) {
        if (!this.selection) {
            return;
        }
        e.clipboardData.setData('text/plain', this.getSelectionText());
        e.preventDefault();
    }

}



/////////////////////////////////////////конец куска чужого кода