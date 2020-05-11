import {call, takeEvery, select, put} from "@redux-saga/core/effects";
import {
    DRAFT_ADD_PAGE_IMITATION, DRAFT_NEED_CHECK_PAGE_IMITATION,
    DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION,
    DRAFT_CHANGE_PAPER_TYPE, DRAFT_NEED_CHANGE_PAGE_FIELDS
} from "../../../redux/actiontypes";
import * as St from "../../styles/ConstructorStyles/RichTextEditorStyle.module.css";
import * as $ from "jquery";
import {
    DraftAddPageIMITATION,
    DraftChangeFontBasicUnitInVmax,
    DraftChangeMonitorPaperSize, DraftNeedCheckPageImitation,
    DraftRemovePageIMITATION, DraftSetPageFieldsToStore
} from "../../../redux/actions";
import {A4_Page_PAPER, basicFontSizeUnitInMM} from "./PageSizeConstants";
import {RichEditoreditor_JSS_STYLE} from "../../styles/ConstructorStyles/RichTextEditorStyle___JSS";
import {inlineStyleMap, getInlineStyleMap, setInlineStyleMap} from "../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import {UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE} from "../../styles/ConstructorStyles/DraftStyles/FONT_SIZE_STYLES";

export function* sagaWatcherDraft() {
    yield takeEvery(DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION, ScrollToCurCaret);
    yield takeEvery(DRAFT_NEED_CHECK_PAGE_IMITATION, CheckPageImitation);
    yield takeEvery(DRAFT_CHANGE_PAPER_TYPE, ChangePaperTypeEffects);
    yield takeEvery(DRAFT_NEED_CHANGE_PAGE_FIELDS, ChangePaperFieldEffects);


}

/*
function *ChangePaperTypeEffects(action) {
    const newPaperType=action.payload;
    const basicWidthOfViewInVmax= yield select((state)=>state.Draft.basicWidthOfViewInVmax);
    const ScaleOfView= yield select((state)=>state.Draft.ScaleOfView);

    const newWidthInVmax=ScaleOfView*basicWidthOfViewInVmax;//где vmax на самом деле vw
    const newHeightInVmax=newWidthInVmax*newPaperType.height/newPaperType.width;
    const newUnitOfFontSizeInVmax=newHeightInVmax*basicFontSizeUnitInMM/newPaperType.height;

    let NEW_FONT_SIZE_STYLES=UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE(newUnitOfFontSizeInVmax);
    let inlineStyleMap=getInlineStyleMap();
    setInlineStyleMap({...inlineStyleMap, ...NEW_FONT_SIZE_STYLES});

    yield put(DraftChangeMonitorPaperSize({
        width: newWidthInVmax,
        height:newHeightInVmax,
    }));
    yield put(DraftChangeFontBasicUnitInVmax(newUnitOfFontSizeInVmax));
}
*/


function *ChangePaperTypeEffects(action) {
    const newPaperType=action.payload;
    const basicWidthOfViewInVmax= yield select((state)=>state.Draft.basicWidthOfViewInVmax);
    const ScaleOfView= yield select((state)=>state.Draft.ScaleOfView);

    const newWidthInVmax=ScaleOfView*basicWidthOfViewInVmax;//где vmax на самом деле vw
    const newHeightInVmax=newWidthInVmax*newPaperType.height/newPaperType.width;
    const newUnitOfFontSizeInVmax=newHeightInVmax*basicFontSizeUnitInMM/newPaperType.height;

    let NEW_FONT_SIZE_STYLES=UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE(newUnitOfFontSizeInVmax);
    let inlineStyleMap=getInlineStyleMap();
    setInlineStyleMap({...inlineStyleMap, ...NEW_FONT_SIZE_STYLES});

    yield put(DraftChangeMonitorPaperSize({
        width: newWidthInVmax,
        height:newHeightInVmax,
    }));
    yield put(DraftChangeFontBasicUnitInVmax(newUnitOfFontSizeInVmax));
}

function *ChangePaperFieldEffects(action) {

    const {topField, bottomField, leftField, rightField}=action.payload;//в сm

    const basicWidthOfViewInVmax= yield select((state)=>state.Draft.basicWidthOfViewInVmax);
    const ScaleOfView= yield select((state)=>state.Draft.ScaleOfView);
    const curPaperType=yield select((state)=>state.Draft.curPagePaperType);



    const newWidthInVmax=ScaleOfView*basicWidthOfViewInVmax;

    const newTopFieldInVW=topField*10/curPaperType.width*newWidthInVmax;
    const newBottomFieldInVW=bottomField*10/curPaperType.width*newWidthInVmax;

    const newLeftFieldInVW=leftField*10/curPaperType.width*newWidthInVmax;
    const newRightFieldInVW=rightField*10/curPaperType.width*newWidthInVmax;

    const newHeightInVmax=newWidthInVmax*curPaperType.height/curPaperType.width-(topField*10+bottomField*10)/curPaperType.width*newWidthInVmax;

    $(`.DraftEditor-root`).css({padding:`${newTopFieldInVW}vw ${newRightFieldInVW}vw ${newBottomFieldInVW}vw ${newLeftFieldInVW}vw`});//в vw

    yield put(DraftChangeMonitorPaperSize({
        width: newWidthInVmax,
        height:newHeightInVmax,
    }));
    yield put(DraftNeedCheckPageImitation())
    yield put(DraftSetPageFieldsToStore({topField:newTopFieldInVW, bottomField:newBottomFieldInVW, leftField:newLeftFieldInVW, rightField:newRightFieldInVW}))
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

    const monitorPaperSize=yield select((state)=>state.Draft.monitorPaperSize);//в vmax
    const bottomLinePaper= yield select((state)=>state.Draft.bottomLinePaper);//в vmax

    let monitorWidth=window.innerWidth;//в px !!!!!!именно от window а не dcument.documentelement ибо надо с учетом полосы прокрутки, т к css ее судя по всему учитывает , а остальное держится на нем
    const bottomEditorTextSpaceInVmax=$(`.DraftEditor-root`).outerHeight(true)/(monitorWidth/100);//в vmax

    let pageImitationNeedCount;

    if (bottomEditorTextSpaceInVmax>bottomLinePaper){
        pageImitationNeedCount=Math.ceil((bottomEditorTextSpaceInVmax-bottomLinePaper)/monitorPaperSize.height);

        for (let i=0; i<pageImitationNeedCount;i++)
            yield  put(DraftAddPageIMITATION());
    }
    else  if(bottomEditorTextSpaceInVmax<bottomLinePaper-monitorPaperSize.height){//текст выше верхней границы последней страницы
        pageImitationNeedCount=Math.ceil((bottomLinePaper-monitorPaperSize.height-bottomEditorTextSpaceInVmax)/monitorPaperSize.height);

        for (let i=0; i<pageImitationNeedCount;i++)
            yield  put(DraftRemovePageIMITATION());
    }

}

