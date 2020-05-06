import {call, takeEvery, select, put} from "@redux-saga/core/effects";
import {
    DRAFT_ADD_PAGE_IMITATION, DRAFT_NEED_CHECK_PAGE_IMITATION,
    DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION,
    DRAFT_CHANGE_PAPER_TYPE
} from "../../../redux/actiontypes";
import * as St from "../../styles/ConstructorStyles/RichTextEditorStyle.module.css";
import * as $ from "jquery";
import {
    DraftAddPageIMITATION,
    DraftChangeFontBasicUnitInVmax,
    DraftChangeMonitorPaperSize,
    DraftRemovePageIMITATION
} from "../../../redux/actions";
import {A4_Page_PAPER, basicFontSizeUnitInMM} from "./PageSizeConstants";
import {RichEditoreditor_JSS_STYLE} from "../../styles/ConstructorStyles/RichTextEditorStyle___JSS";
import {inlineStyleMap} from "../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import {UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE} from "../../styles/ConstructorStyles/DraftStyles/FONT_SIZE_STYLES";

export function* sagaWatcherDraft() {
    yield takeEvery(DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION, ScrollToCurCaret);
    yield takeEvery(DRAFT_NEED_CHECK_PAGE_IMITATION, CheckPageImitation);
    yield takeEvery(DRAFT_CHANGE_PAPER_TYPE, ChangePaperTypeEffects);


}

/*function* sagaDraftNeedWorker(action) {
    switch (action.type) {
        case DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION:  yield call(ScrollToCurCaret); break;
        case DRAFT_NEED_CHECK_PAGE_IMITATION: yield call(CheckPageImitation, action.payload); break;
    }

}*/

function *ChangePaperTypeEffects(action) {
    const newPaperType=action.payload;
    const basicWidthOfViewInVmax= yield select((state)=>state.Draft.basicWidthOfViewInVmax);
    const ScaleOfView= yield select((state)=>state.Draft.ScaleOfView);

    const newWidthInVmax=ScaleOfView*basicWidthOfViewInVmax;
    const newHeightInVmax=newWidthInVmax*newPaperType.height/newPaperType.width;
    const newUnitOfFontSizeInVmax=newHeightInVmax*basicFontSizeUnitInMM/newPaperType.height;

    let NEW_FONT_SIZE_STYLES=UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE(newUnitOfFontSizeInVmax);
    inlineStyleMap={...inlineStyleMap, ...NEW_FONT_SIZE_STYLES}

    yield put(DraftChangeMonitorPaperSize({
        width: newWidthInVmax,
        height:newHeightInVmax,
    }));
    yield put(DraftChangeFontBasicUnitInVmax(newUnitOfFontSizeInVmax));



}
function *ScrollToCurCaret() {
    if (!window.getSelection().isCollapsed)
        return;
    const ContainerForPagesAndEditor=document.querySelector(`.${St.ContainerForPagesAndEditor}`);
    let clientRectSelection;
    let RectEditorContainer;
    try {
        clientRectSelection = window.getSelection().getRangeAt(0).startContainer.parentElement.getBoundingClientRect();
        RectEditorContainer = ContainerForPagesAndEditor.getBoundingClientRect();
    }
    catch (e) {
        return;
    }
    let dif1=clientRectSelection.bottom-RectEditorContainer.bottom;
    let dif2=clientRectSelection.top-RectEditorContainer.top;
    if (dif1>0){
        ContainerForPagesAndEditor.scrollTop+=dif1;
    }
    else
    if (dif2<0) {
        ContainerForPagesAndEditor.scrollTop+=dif2;
    }
}
function *CheckPageImitation() {//action.payload
    const monitorPaperSize=yield select((state)=>state.Draft.monitorPaperSize);
    const bottomLinePaper= yield select((state)=>state.Draft.bottomLinePaper);

    let monitorWidth=document.documentElement.offsetWidth;
    const bottomEditorTextSpace=$(`.DraftEditor-root`).outerHeight(true);
    if (bottomEditorTextSpace>bottomLinePaper){
        let action=DraftAddPageIMITATION();
        yield  put(action);
    }
    else  if(bottomEditorTextSpace<bottomLinePaper-monitorPaperSize.height*monitorWidth/100){
        let action=DraftRemovePageIMITATION();
        yield  put(action);
    }
}