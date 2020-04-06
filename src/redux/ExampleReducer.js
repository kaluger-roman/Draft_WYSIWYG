import {EXAMPLE_ASYNC_TYPE_ACTION, EXAMPLE_TYPE_ACTION} from "./actiontypes";

const IntialState={
    exinit:0,
    exinit1:2,
};

export const  exampleReducer=(state=IntialState, action)=>{
    switch (action.type) {
        case EXAMPLE_TYPE_ACTION:return {...state, ex:state.exinit1+action.payload};
        case EXAMPLE_ASYNC_TYPE_ACTION:return {...state, ex:state.exinit1+action.payload};
        default: return state
    }
};