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
        $(`#RichEditoreditor_>.DraftEditor-root`).css({width:`${initialWidthPX}px`/*,visibility:`visible`*/});
        $(`#RichEditoreditor_`).css({width:`${initialWidthPX}px`, webkitTransformOrigin: '50% 0%', transformOrigin:' 50% 0%'});

    },0);
}
Initialize();

const InitialState = {
    pageImitationsCount: 1,
    curPagePaperType: LIST_OF_COMMON_PAPER_TYPES[0],//А4
    orientation: VERTICAL_ORIENTATION_PAGE_CONST,
    pageFields: {topField: 2, bottomField: 2, leftField: 20, rightField: 20},//в mm
    ScaleOfView: initialScaleOfView,//применять к эдементу вокруг редактора transform scale()
    bottomLinePaper: initialHeightPX,//в px
    selectedTableCells:undefined,
    MergeSelectedCellsNeed:false,
    SplitSelectedCellsNeed:false,

    NeedDeleteRowsWithSelection:false,
    NeedDeleteColumnsWithSelection:false,
    NeedDeleteRowsWithFULLSelection:false,
    NeedDeleteColumnsWithFULLSelection:false,

    /*IdFirstColCellToShowInsertSign:undefined,
    IdFirstRowCellToShowInsertSign:undefined,*/
    IdFirstColCellToInsertTable:undefined,
    IdFirstRowCellToInsertTable:undefined,
    IdCellsRowToShowInsertSign:undefined,
    IdCellsColToShowInsertSign:undefined,


    ConfigSplitTableCell:{cols:1, rows:1},

    SelectedTableRowSFirstCellIdS: undefined,
    SelectedTableColumnFirstCellId: undefined,
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
        case types.DRAFT_DEFINE_SELECTED_TABLE_CELLS:
            return {...state, selectedTableCells: action.payload};
        case types.DRAFT_NEED_MERGE_TABLE_CELLS:
            return {...state, MergeSelectedCellsNeed: action.payload};
        case types.DRAFT_NEED_SPLIT_TABLE_CELLS:
            return {...state, SplitSelectedCellsNeed: action.payload};
        case types.DRAFT_CONFIG_SPLIT_TABLE_CELLS:
            return {...state, ConfigSplitTableCell: action.payload};
        case types.DRAFT_SELECT_TABLE_ROW:
            return {...state, SelectedTableRowSFirstCellIdS: action.payload};
        case types.DRAFT_SELECT_TABLE_COLUMN:
            return {...state, SelectedTableColumnFirstCellId: action.payload};
        case types.DRAFT_NEED_DELETE_ROWS_WITH_SELECTION:
            return {...state, NeedDeleteRowsWithSelection: action.payload};
        case types.DRAFT_NEED_DELETE_COLUMNS_WITH_SELECTION:
            return {...state, NeedDeleteColumnsWithSelection: action.payload};
        case types.DRAFT_NEED_DELETE_ROWS_WITH_FULL_SELECTION:
            return {...state, NeedDeleteRowsWithFULLSelection: action.payload};
        case types.DRAFT_NEED_DELETE_COLUMNS_WITH_FULL_SELECTION:
            return {...state, NeedDeleteColumnsWithFULLSelection: action.payload};

       /* case types.DRAFT_NEED_SHOW_INSERT_COLUMN_SIGN:
            return {...state, IdFirstColCellToShowInsertSign: action.payload};
        case types.DRAFT_NEED_SHOW_INSERT_ROW_SIGN:
            return {...state, IdFirstRowCellToShowInsertSign: action.payload};*/
        case types.DRAFT_INSERT_COLUMN_TABLE:
            return {...state, IdFirstColCellToInsertTable: action.payload};
        case types.DRAFT_INSERT_ROW_TABLE:
            return {...state, IdFirstRowCellToInsertTable: action.payload};
        case types.DRAFT_DEFINE_CELLS_SHOW_INSERT_COL_SIGN_AFTER:
            return {...state,IdCellsColToShowInsertSign : action.payload};
        case types.DRAFT_DEFINE_CELLS_SHOW_INSERT_ROW_SIGN_AFTER:
            return {...state,IdCellsRowToShowInsertSign : action.payload};



        default:
            return state
    }
};