import {combineReducers} from 'redux';
import {MainPageReducer} from "./MainPageReducer";
import {AppReducer} from "./AppReducer";

export const rootReducer = combineReducers({
        mainpage: MainPageReducer,
        common: AppReducer,
    }
);