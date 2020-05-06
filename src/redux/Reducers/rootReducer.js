import {combineReducers} from 'redux';
import {MainPageReducer} from "./MainPageReducer";
import {AppReducer} from "./AppReducer";
import {DraftEditorReducer} from "./DraftEditorReducer";

export const rootReducer = combineReducers({
        mainpage: MainPageReducer,
        common: AppReducer,
        Draft: DraftEditorReducer
    }
);