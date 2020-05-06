const types= require( "./actiontypes");

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
export function DraftChangeMonitorPaperSize(newPaperMonitorSize) {
    return  {
        type: types.DRAFT_CHANGE_MONITOR_PAPER_SIZE,
        payload:newPaperMonitorSize,
    };
}
export function DraftChangeFontBasicUnitInVmax(newFontBasicUnitInVmax) {
    return  {
        type: types.DRAFT_CHANGE_FONT_BASIC_UNIT_IN_VMAX,
        payload:newFontBasicUnitInVmax,
    };
}


/*export function DraftChangeMonitorPaperSize(payload) {
    return  {
        type: types.DRAFT_CHANGE_PAPER_TYPE,
        payload:payload,
    };
}*/
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