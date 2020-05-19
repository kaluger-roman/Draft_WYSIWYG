import {call, takeEvery, select, put} from "@redux-saga/core/effects";
import {
    DRAFT_NEED_CHECK_PAGE_IMITATION,
    DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION,
    DRAFT_CHANGE_PAPER_TYPE,
    DRAFT_NEED_CHANGE_PAGE_FIELDS,
    DRAFT_SET_PAGE_FIELDS_TO_STORE,
    DRAFT_CHANGE_PAPER_ORIENTATION, DRAFT_CHANGE_SCALE
} from "../../../redux/actiontypes";
import * as St from "../../styles/ConstructorStyles/RichTextEditorStyle.module.css";
import * as $ from "jquery";
import {
    DraftAddPageIMITATION, DraftChangeBottomLinePaper,
    DraftChangeMonitorPaperSize, DraftChangePaperType,
    DraftRemovePageIMITATION, DraftSetPageFieldsToStore
} from "../../../redux/actions";
import {
    LIST_OF_COMMON_PAPER_TYPES,
    Custom_Page_PAPER,
    basicFontSizeUnitInMM,
    UnitOfFontSizePX,
    basicFontSizeUnitInCM
} from "./PageSizeConstants";

export function* sagaWatcherDraft() {
    yield takeEvery(DRAFT_NEED_SCROLL_TO_CURRENT_CARET_POSITION, ScrollToCurCaret);
    yield takeEvery(DRAFT_NEED_CHECK_PAGE_IMITATION, CheckPageImitation);
    yield takeEvery(DRAFT_CHANGE_PAPER_TYPE, ChangePaperTypeEffects);
    yield takeEvery(DRAFT_SET_PAGE_FIELDS_TO_STORE, ChangePaperFieldsEffects);
    yield takeEvery(DRAFT_CHANGE_PAPER_ORIENTATION, ChangePaperOrientationEffects);
    yield takeEvery(DRAFT_CHANGE_SCALE, ChangeScaleEffects);


}

export const convertMMtoPX = (valMM) => valMM * 3.779528;
export const convertCMtoPX = (valCM) => valCM * 37.79528;
export const convertPXtoMM = (valPX) => valPX / 3.779528;
export const convertPXtoCM = (valPX) => valPX / 37.79528;

export const getEffectivePageHeightInPX = (pageType, orientation, fieldsObj) => convertMMtoPX(getEffectivePageHeightInMM(pageType, orientation, fieldsObj));
export const getEffectivePageHeightInMM = (pageType, orientation, {topField,bottomField})=>(pageType[orientation].height-(topField + bottomField));//страница без полей высота

function *getUptimeState
(
    {fieldsObj=null,pageImitationsCount=null,curPagePaperType=null,orientation=null,ScaleOfView=null,bottomLinePaper=null} =
    {fieldsObj:null,pageImitationsCount:null,curPagePaperType:null,orientation:null,ScaleOfView:null,bottomLinePaper:null}
)
{//если внутри саги нужно вызвать другую сагу,
    fieldsObj            = fieldsObj            ? fieldsObj           :  yield select((state) => state.Draft.pageFields);                 // где будут уже обновленные данные состояния ,
    pageImitationsCount  = pageImitationsCount  ? pageImitationsCount :  yield select((state) => state.Draft.pageImitationsCount);         // а не передавать вручную
    curPagePaperType     = curPagePaperType     ? curPagePaperType    :  yield select((state) => state.Draft.curPagePaperType);             //
    orientation          = orientation          ? orientation         :  yield select((state) => state.Draft.orientation);
    ScaleOfView          = ScaleOfView          ? ScaleOfView         :  yield select((state) => state.Draft.ScaleOfView);
    bottomLinePaper      = bottomLinePaper      ? bottomLinePaper     :  yield select((state) => state.Draft.bottomLinePaper);
    return {fieldsObj,pageImitationsCount,curPagePaperType,orientation,ScaleOfView,bottomLinePaper};
}

function AlignEditor(curPagePaperType, orientation) {
    $(`.DraftEditor-root`).css({width: `${curPagePaperType[orientation].width}mm`});
   $(`#RichEditoreditor_`).css({width: `${curPagePaperType[orientation].width}mm`});
}


function* ChangeScaleEffects(action) {
    const newScale=action.payload;
    $(`#RichEditoreditor_`).css({transform: `scale(${newScale/100})`,webkitTransformOrigin: '50% 0%', transformOrigin:' 50% 0%'});






}

function* ChangePaperTypeEffects(action) {
    const orientation = yield select((state) => state.Draft.orientation);
    const curPagePaperType = action.payload;
    AlignEditor(curPagePaperType, orientation);
    yield call(CheckPageImitation, null,{curPagePaperType:curPagePaperType});
}
function* ChangePaperOrientationEffects(action) {
    const orientation = action.payload;
    const curPagePaperType = yield select((state) => state.Draft.curPagePaperType);
    yield call(AlignEditor,curPagePaperType, orientation);
    yield call(CheckPageImitation, null,{orientation:orientation});
}

function* ChangePaperFieldsEffects(action) {
    const {topField, rightField, bottomField, leftField} = action.payload;//в mm
    $(`.DraftEditor-root`).css({padding: `${topField}mm ${rightField}mm ${bottomField}mm ${leftField}mm`,});
    yield call(CheckPageImitation, null,{fieldsObj:action.payload});
}

function* calculateDispatchBottomLinePaper(action,preserveParams) {
    let {fieldsObj,pageImitationsCount, curPagePaperType,orientation}=yield call(getUptimeState, preserveParams);//проверка есть ли параметры, которые не успели попасть в стейт, если да, брать в учет их
    const newBottomLine = pageImitationsCount * convertMMtoPX(curPagePaperType[orientation].height) - (pageImitationsCount - 1) * convertMMtoPX(fieldsObj.topField + fieldsObj.bottomField);
    yield put(DraftChangeBottomLinePaper(newBottomLine));
}

function* ScrollToCurCaret() {
    const curSelection=window.getSelection();
    if(!curSelection.anchorNode)
        return;

    const ContainerForPagesAndEditor = document.querySelector(`.${St.ContainerForPagesAndEditor}`);
    if ((!curSelection.isCollapsed)||
        (!curSelection.containsNode(ContainerForPagesAndEditor,true))||
        !((curSelection.focusNode.nodeName==='#text')||(curSelection.focusNode.nodeName==='SPAN')))
        return;

    let clientRectSelection;
    let RectEditorContainer;
    try {
        clientRectSelection = curSelection.getRangeAt(0)./*startContainer.parentElement.*/getBoundingClientRect();
        RectEditorContainer = ContainerForPagesAndEditor.getBoundingClientRect();
    } catch (e) {
        return;
    }
    let dif1 = clientRectSelection.bottom - RectEditorContainer.bottom;
    let dif2 = clientRectSelection.top - RectEditorContainer.top;
    if (dif1 > 0) {
        ContainerForPagesAndEditor.scrollTop += dif1;
    } else if (dif2 < 0) {
        ContainerForPagesAndEditor.scrollTop += dif2;
    }
}

function* CheckPageImitation(action,preserveParams) {
    yield call(calculateDispatchBottomLinePaper,null,preserveParams);
    let {fieldsObj, bottomLinePaper,curPagePaperType,orientation}=yield call(getUptimeState, preserveParams);//проверка есть ли параметры, которые не успели попасть в стейт, если да, брать в учет их

    const curEffHeight = getEffectivePageHeightInPX(curPagePaperType, orientation, fieldsObj);
    const bottomEditorTextSpaceInPX = $(`.DraftEditor-root`).outerHeight(true);//в px

    let pageImitationNeedCount;

    if (bottomEditorTextSpaceInPX > (bottomLinePaper /*- convertMMtoPX(fieldsObj.bottomField)*/)) {
        pageImitationNeedCount = Math.ceil((bottomEditorTextSpaceInPX - /*(*/bottomLinePaper/* - convertMMtoPX(fieldsObj.bottomField))*/) / curEffHeight);

        for (let i = 0; i < pageImitationNeedCount; i++)
        {
            yield  put(DraftAddPageIMITATION());
        }

        yield call(calculateDispatchBottomLinePaper)
    }
    else if (bottomEditorTextSpaceInPX < (bottomLinePaper /*- convertMMtoPX(fieldsObj.bottomField)*/ - curEffHeight)) {//текст выше верхней границы последней страницы
        pageImitationNeedCount = Math.ceil((bottomLinePaper /*- convertMMtoPX(fieldsObj.bottomField)*/ - curEffHeight - bottomEditorTextSpaceInPX) / curEffHeight);

        for (let i = 0; i < pageImitationNeedCount; i++)
        {
            yield  put(DraftRemovePageIMITATION());
        }

        yield call(calculateDispatchBottomLinePaper)
    }
}

