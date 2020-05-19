import {
    VERTICAL_ORIENTATION_PAGE_CONST,
    HORIZONTAL_ORIENTATION_PAGE_CONST,
    LIST_OF_COMMON_PAPER_TYPES,
    basicFontSizeUnitInMM,
    UnitOfFontSizePX
} from "../../components/CommonComps/Service&SAGA/PageSizeConstants";
import * as $ from "jquery";
import {convertMMtoPX} from "../../components/CommonComps/Service&SAGA/DRAFT_MAIN_SAGA_WATCHER";

const types = require("../actiontypes");

const initialScaleOfView = 100;//масштаб %
const initialHeightPX = convertMMtoPX(LIST_OF_COMMON_PAPER_TYPES[0][VERTICAL_ORIENTATION_PAGE_CONST].height);
const initialWidthPX = initialHeightPX * LIST_OF_COMMON_PAPER_TYPES[0][VERTICAL_ORIENTATION_PAGE_CONST].width / LIST_OF_COMMON_PAPER_TYPES[0][VERTICAL_ORIENTATION_PAGE_CONST].height;

function Initialize() {//нужно вызвать после перехода в раздел конструктора
    setTimeout(()=>{
        $(`.DraftEditor-root`).css({width:`${initialWidthPX}px`/*,visibility:`visible`*/});
        $(`#RichEditoreditor_`).css({width:`${initialWidthPX}px`, webkitTransformOrigin: '50% 0%', transformOrigin:' 50% 0%'});

    },0);
}
Initialize();

const InitialState = {
    pageImitationsCount: 1,
    curPagePaperType: LIST_OF_COMMON_PAPER_TYPES[0],//А4
    orientation: VERTICAL_ORIENTATION_PAGE_CONST,
    pageFields: {topField: 0, bottomField: 0, leftField: 0, rightField: 0},//в mm
    ScaleOfView: initialScaleOfView,//применять к эдементу вокруг редактора transform scale()
    bottomLinePaper: initialHeightPX,//в px
};
export const DraftEditorReducer = (state = InitialState, action) => {
    switch (action.type) {
        case types.DRAFT_ADD_PAGE_IMITATION:
            return {...state, pageImitationsCount: state.pageImitationsCount + 1};
        case types.DRAFT_REMOVE_PAGE_IMITATION:
            return {...state, pageImitationsCount: state.pageImitationsCount - 1};
        case types.DRAFT_CHANGE_PAPER_TYPE:
            return {...state, curPagePaperType: action.payload};
        case types.DRAFT_CHANGE_PAPER_ORIENTATION:
            return {...state, orientation: action.payload};
        case types.DRAFT_CHANGE_SCALE:
            return {...state, ScaleOfView: action.payload};
        case types.DRAFT_CHANGE_BOTTOM_LINE_PAPER:
            return {...state, bottomLinePaper: action.payload};
        case types.DRAFT_SET_PAGE_FIELDS_TO_STORE:
            return {...state, pageFields: action.payload};
        default:
            return state
    }
};