const types= require( "../actiontypes");
import RouteConstants from './../../Routing/ROUTECONSTANTS'

const IntialState={
    CurPage:RouteConstants.HOME,
};

export const  AppReducer=(state=IntialState, action)=>{
    switch (action.type) {
        case types.CHANGE_PAGE: return {...state, CurPage: action.payload};
        default: return state
    }
};