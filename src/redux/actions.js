const types= require( "./actiontypes");
export const ACTION_TYPES_TO_THROTTLE_MIDDLEWARE_CHECK_NOTNULL=[//тротлить естли пэйлоэд одинаковый
    types.DRAFT_INSERT_COLUMN_TABLE,
    types.DRAFT_INSERT_ROW_TABLE,
];
export const ACTION_TYPES_TO_THROTTLE_MIDDLEWARE_ALWAYS=[//тротлить всегда
];

export function OpenCloseHelpMessenger() {
    return{
        type:types.CLICK_HELP_MESSAGE_BUTTON,
    }
}
export function ScrollUndefindAction() {
    return  {
        type: types.SCROLL_UNDEFINED_ACTION,
        payload: pageYOffset
    };
}
export function ChangePage(curLocation) {
    return  {
        type: types.CHANGE_PAGE,
        payload: curLocation
    };
}
//////////////////////////////////////////////DRAFT/////////////////////////
export function DraftAddPageIMITATION() {
    return  {
        type: types.DRAFT_ADD_PAGE_IMITATION,
    };
}
export function DraftRemovePageIMITATION() {
    return  {
        type: types.DRAFT_REMOVE_PAGE_IMITATION,
    };
}
export function DraftChangePaperType(newPaperType) {
    return  {
        type: types.DRAFT_CHANGE_PAPER_TYPE,
        payload:newPaperType,
    };
}

export function DraftChangePaperOrientation(newPaperOrientation) {
    return  {
        type: types.DRAFT_CHANGE_PAPER_ORIENTATION,
        payload:newPaperOrientation,
    };
}

export function DraftChangeScale(newScale) {
    return  {
        type: types.DRAFT_CHANGE_SCALE,
        payload:newScale,
    };
}


export function DraftChangeBottomLinePaper(newBottomLine) {
    return  {
        type: types.DRAFT_CHANGE_BOTTOM_LINE_PAPER,
        payload:newBottomLine,
    };
}
export function DraftNeedScrollToCurrentCaretPosition() {
    return  {
        type: types.DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION,
    };
}

export function DraftNeedCheckPageImitation() {
    return  {
        type: types.DRAFT_NEED_CHECK_PAGE_IMITATION,
    };
}

export function DraftDefineSelectedTableCells(newSelectedCells) {
    return  {
        type: types.DRAFT_DEFINE_SELECTED_TABLE_CELLS,
        payload: newSelectedCells,
    };
}
export function DraftNeedMergeTableCells(isNeed) {
    return  {
        type: types.DRAFT_NEED_MERGE_TABLE_CELLS,
        payload: isNeed,
    };
}
export function DraftNeedSplitTableCells(isNeed) {
    return  {
        type: types.DRAFT_NEED_SPLIT_TABLE_CELLS,
        payload: isNeed,
    };
}
export function DraftConfigSplitTableCells(config) {
    return  {
        type: types.DRAFT_CONFIG_SPLIT_TABLE_CELLS,
        payload: config,
    };
}
export function DraftSelectTableRow(SelectedTableRowSFirstCellIdS) {
    return  {
        type: types.DRAFT_SELECT_TABLE_ROW,
        payload: SelectedTableRowSFirstCellIdS,
    };
}
export function DraftSelectTableColumn(selectedFirstCellIDInCol) {
    return  {
        type: types.DRAFT_SELECT_TABLE_COLUMN,
        payload: selectedFirstCellIDInCol,
    };
}
export function DraftSetPageFieldsToStore(newFieldsInPX) {
    return  {
        type: types.DRAFT_SET_PAGE_FIELDS_TO_STORE,
        payload:newFieldsInPX,
    };
}
export function DraftNeedDeleteRowsWithSelection(isNeed) {
    return  {
        type: types.DRAFT_NEED_DELETE_ROWS_WITH_SELECTION,
        payload:isNeed,
    };
}
export function DraftNeedDeleteColumnsWithSelection(isNeed) {
    return  {
        type: types.DRAFT_NEED_DELETE_COLUMNS_WITH_SELECTION,
        payload:isNeed,
    };
}
export function DraftNeedDeleteRowsWithFULLSelection(isNeed) {
    return  {
        type: types.DRAFT_NEED_DELETE_ROWS_WITH_FULL_SELECTION,
        payload:isNeed,
    };
}
export function DraftNeedDeleteColumnsWithFULLSelection(isNeed) {
    return  {
        type: types.DRAFT_NEED_DELETE_COLUMNS_WITH_FULL_SELECTION,
        payload:isNeed,
    };
}
export function DraftNeedShowInsertColumnSign(afterWhatID) {
    return  {
        type: types.DRAFT_NEED_SHOW_INSERT_COLUMN_SIGN,
        payload:afterWhatID,
    };
}
export function DraftNeedShowInsertRowSign(afterWhatID) {
    return  {
        type: types.DRAFT_NEED_SHOW_INSERT_ROW_SIGN,
        payload:afterWhatID,
    };
}
export function DraftInsertColumnTable(afterWhatID) {
    return  {
        type: types.DRAFT_INSERT_COLUMN_TABLE,
        payload:afterWhatID,
    };
}
export function DraftInsertRowTable(afterWhatID) {
    return  {
        type: types.DRAFT_INSERT_ROW_TABLE,
        payload:afterWhatID,
    };
}
export function DraftDefineCellsColShowInsertSign(cellsIDs) {
    return  {
        type: types.DRAFT_DEFINE_CELLS_SHOW_INSERT_COL_SIGN_AFTER,
        payload:cellsIDs,
    };
}
export function DraftDefineCellsRowShowInsertSign(cellsIDs) {
    return  {
        type: types.DRAFT_DEFINE_CELLS_SHOW_INSERT_ROW_SIGN_AFTER,
        payload:cellsIDs,
    };
}







export function exampleAsyncAction() {
    return async (dispatch,getState)=>{

        await new Promise((resolve, reject) => {
            setTimeout(()=>{}, 1000);
            resolve(0)});
        const response=await fetch('https://jsonplaceholder.typicode.com/comments?_limit=20');
        const json=await response.json();
        dispatch( {
            type: types.EXAMPLE_ASYNC_TYPE_ACTION,
            payload: json
        });
    }
}