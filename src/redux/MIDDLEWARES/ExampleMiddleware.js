export function ExampleMiddleware({dispatch}) {//происходит при событии , можно не отправлять дальше некст, чтобы не вызвать событие, а вызвать свое новое
    return function (next) {
        return function (action) {
            if(action.type===''){

            }
            return next(action)
        }
    }
}
