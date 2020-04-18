const types= require( "../actiontypes");

const IntialState={
    mainpanel:{
        isshown: true,
    },
    scroll:{
        oldscroll:0,
        curscroll:0,
    },
};

export const  MainPageReducer=(state=IntialState, action)=>{
    switch (action.type) {
        case types.SCROLL_UNDEFINED_ACTION: return {...state, scroll:{curscroll: action.payload, oldscroll: state.scroll.curscroll}};
        default: return state
    }
};