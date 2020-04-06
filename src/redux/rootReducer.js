import {combineReducers} from 'redux';
import {MainPageReducer} from "./MainPageReducer";

export const rootReducer=combineReducers({
    mainpage: MainPageReducer,
    }
);