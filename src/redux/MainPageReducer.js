const types= require( "./actiontypes");

import * as _ from 'lodash';

const IntialState={
    mainpanel:{
        isshown: true,
    },
    scroll:{
        oldscroll:0,
        curscroll:0,
    },
    exinit:0,
    exinit1:2,
};

export const  MainPageReducer=(state=IntialState, action)=>{
    switch (action.type) {
        case types.SCROLL_UNDEFINED_ACTION: return {...state, scroll:{curscroll: action.payload, oldscroll: state.scroll.curscroll}};
        case types.SCROLL_DOWN_ACTION:return {...state, mainpanel: {isshown: state.mainpanel.isshown}};
        case types.SCROLL_UP_ACTION:return {...state, mainpanel: {isshown: state.mainpanel.isshown}};
        default: return state
    }
};