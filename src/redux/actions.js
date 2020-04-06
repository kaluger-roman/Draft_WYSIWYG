const types= require( "./actiontypes");


export function exampleAction() {
    return{
        type:types.EXAMPLE_TYPE_ACTION,
        payload:2
    }
}
export function ScrollDownAction() {
    return{
        type:types.SCROLL_DOWN_ACTION,
        payload:false
    }
}
export function ScrollUpAction() {
    return{
        type:types.SCROLL_UP_ACTION,
        payload:true
    }
}
export function OpenCloseHelpMessenger() {
    return{
        type:types.CLICK_HELP_MESSAGE_BUTTON,
        //payload:true
    }
}
export function ScrollUndefindAction() {
  //  console.log(types.SCROLL_UNDEFINED_ACTION);
    const act={
        type: types.SCROLL_UNDEFINED_ACTION,
        payload: pageYOffset
    };
    return act;
}
export function exampleAsyncAction() {
    return async (dispatch,getState)=>{

        await new Promise((resolve, reject) => {
            setTimeout(()=>{}, 1000);
            resolve(0)});
        const response=await fetch('https://jsonplaceholder.typicode.com/comments?_limit=20');
        const json=await response.json();
        dispatch( {
            type: types.EXAMPLE_ASYNC_TYPE_ACTION,
            payload: json
        });
    }
}