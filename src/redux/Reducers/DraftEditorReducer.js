import {A4_Page_PAPER,basicFontSizeUnitInMM} from "../../components/CommonComps/Service&SAGA/PageSizeConstants";

const types= require( "../actiontypes");
import * as St from "../../components/styles/ConstructorStyles/RichTextEditorStyle.module.css";


import {RichEditoreditor_JSS_STYLE} from "../../components/styles/ConstructorStyles/RichTextEditorStyle___JSS";

const initialScaleOfView=1;//масштаб
const initialWidthInVmax=initialScaleOfView*parseInt(RichEditoreditor_JSS_STYLE.width);
const initialHeightInVmax=initialWidthInVmax*A4_Page_PAPER.height/A4_Page_PAPER.width;
export const initialUnitOfFontSizeInVmax=initialHeightInVmax*basicFontSizeUnitInMM/A4_Page_PAPER.height;

const InitialState={
    pageImitationsCount: 1,
    curPagePaperType: A4_Page_PAPER,
    monitorPaperSize:{
        width: initialWidthInVmax,
        height:initialHeightInVmax,
    },
    orientation:'vertical',//  /horizontal
    pageFields:{topField:0, bottomField:0, leftField:0, rightField:0},
    basicWidthOfViewInVmax:initialWidthInVmax, //менять только в коде, начальная величина от чего отталкиваются все размеры, берется непосредственно из начального css, тут для удобства, если надо менять в когде то только с помощью масштаба
    ScaleOfView:initialScaleOfView,
    bottomLinePaper:initialHeightInVmax,//в vmax
    UnitOfFontSizeInVmax:initialUnitOfFontSizeInVmax,//при смене полей урезается страница, экранный пункт шрифта не менять,менять при смене типа страницы
    //SpaceBetweenPages:1//в vmax
};
export const  DraftEditorReducer=(state=InitialState, action)=>{
    switch (action.type) {
        case types.DRAFT_ADD_PAGE_IMITATION: return {...state, pageImitationsCount: state.pageImitationsCount+1};
        case types.DRAFT_REMOVE_PAGE_IMITATION: return {...state, pageImitationsCount: state.pageImitationsCount-1};
        case types.DRAFT_CHANGE_PAPER_TYPE: return {...state, curPagePaperType: action.payload};
        case types.DRAFT_CHANGE_FONT_BASIC_UNIT_IN_VMAX: return {...state, UnitOfFontSizeInVmax: action.payload};
        case types.DRAFT_CHANGE_MONITOR_PAPER_SIZE: return {...state, monitorPaperSize: action.payload};
        case types.DRAFT_CHANGE_BOTTOM_LINE_PAPER: return {...state, bottomLinePaper: action.payload};
        case types.DRAFT_SET_PAGE_FIELDS_TO_STORE: return {...state, pageFields: action.payload};



        default: return state
    }
};