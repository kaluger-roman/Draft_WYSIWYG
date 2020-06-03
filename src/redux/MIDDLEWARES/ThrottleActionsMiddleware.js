import {ACTION_TYPES_TO_THROTTLE_MIDDLEWARE_CHECK_NOTNULL, ACTION_TYPES_TO_THROTTLE_MIDDLEWARE_ALWAYS} from "../actions";
//тротлить при определенном пэйлоуд(не блокировать сброс событий после отработки) или всегдп импорты сверху

let LAST_DISPATCHES_THROTTLED_FUNC={};
let LAST_DISPATCHES_THROTTLED_FUNC_TIMEOUTS={};

const THROTTLE_TIME=300;

export function ThrottleActions(store) {//происходит при событии , можно не отправлять дальше некст, чтобы не вызвать событие, а вызвать свое новое
    return function (next) {
        return function (action) {
            let inNotNull=ACTION_TYPES_TO_THROTTLE_MIDDLEWARE_CHECK_NOTNULL.includes(action.type);
            let inAlways= ACTION_TYPES_TO_THROTTLE_MIDDLEWARE_ALWAYS.includes(action.type);
            if(inNotNull || inAlways){
                let curTime=performance.now();
                let lastTime=LAST_DISPATCHES_THROTTLED_FUNC[action.type];
                LAST_DISPATCHES_THROTTLED_FUNC[action.type]=curTime;
                if ((inNotNull && action.payload)||inAlways){
                        if(LAST_DISPATCHES_THROTTLED_FUNC_TIMEOUTS[action.type]){
                            clearTimeout(LAST_DISPATCHES_THROTTLED_FUNC_TIMEOUTS[action.type]);
                            LAST_DISPATCHES_THROTTLED_FUNC_TIMEOUTS[action.type]=undefined;
                        }
                        if(lastTime){
                            if((curTime-lastTime)>THROTTLE_TIME){
                                return next(action)
                            }
                            else {
                                LAST_DISPATCHES_THROTTLED_FUNC_TIMEOUTS[action.type]=setTimeout(()=>store.dispatch(action), THROTTLE_TIME);
                                return;
                            }
                        }
                    }
            }
            return next(action)
        }
    }
}
