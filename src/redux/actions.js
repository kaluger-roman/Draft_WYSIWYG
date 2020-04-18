const types= require( "./actiontypes");

export function OpenCloseHelpMessenger() {
    return{
        type:types.CLICK_HELP_MESSAGE_BUTTON,
    }
}
export function ScrollUndefindAction() {
    return  {
        type: types.SCROLL_UNDEFINED_ACTION,
        payload: pageYOffset
    };
}
export function ChangePage(curLocation) {
    return  {
        type: types.CHANGE_PAGE,
        payload: curLocation
    };
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