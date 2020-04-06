import {takeEvery,put,call} from 'redux-saga/effects';
import {EXAMPLE_ASYNC_TYPE_ACTION, SCROLL_UNDEFINED_ACTION} from "./actiontypes";
import {exampleAsyncAction} from "./actions";
import * as $ from "jquery";
import {useSelector} from "react-redux";
import {store} from "../index";
export function* sagaWatcher() {
   yield takeEvery(EXAMPLE_ASYNC_TYPE_ACTION, sagaWorker);
   yield takeEvery(SCROLL_UNDEFINED_ACTION, sagaScrollWorker);
}

function* sagaScrollWorker() {
    yield call(ScrollEffect)
}

async function ScrollEffect() {
    /////////////////////кнопки стартовая стр
    {
        let btn = document.getElementById('ntn-90');
        let rect = btn.getBoundingClientRect();
        if ((((rect.top) < document.documentElement.clientHeight) && rect.top > 0) || ((rect.bottom > -document.documentElement.clientHeight / 5) && (((rect.bottom) < document.documentElement.clientHeight)))) {
            $("#ntn-91").animate({top: '+0vmin', left: '0vmin'}, {
                duration: 500,
                queue: true,
                complete: () => $("#ntn-91").clearQueue('fx')
            });
            $("#ntn-92").animate({top: '+0vmin', left: '0vmin'}, {
                duration: 500,
                queue: true,
                complete: () => $("#ntn-92").clearQueue('fx')
            });
        } else {
            $("#ntn-91").animate({top: '20vmin', left: "-60vmin"}, {duration: 0,});
            $("#ntn-92").animate({top: '20vmin', left: '60vmin'}, {duration: 0,});
        }
    }
    /////////////////////видос над кнопками главная стр
    {
        let btn1 = document.getElementById('maincard1');
        let rect1 = btn1.getBoundingClientRect();
        if ((((rect1.top) < document.documentElement.clientHeight) && rect1.top > 0) || ((rect1.bottom > -document.documentElement.clientHeight / 5) && (((rect1.bottom) < document.documentElement.clientHeight)))) {
            $("#jfn67").animate({top: '+0vmin', left: '0vmin'}, {
                duration: 500,
                queue: true,
                complete: () => $("#jfn67").clearQueue('fx')
            });
            $("#videopromo1").animate({top: '+0vmin', left: '0vmin'}, {
                duration: 500,
                queue: true,
                complete: () => $("#videopromo1").clearQueue('fx')
            });
        } else {
            $("#jfn67").animate({top: '20vmin', left: "-60vmin"}, {duration: 0});
            $("#videopromo1").animate({top: '20vmin', left: '60vmin'}, {duration: 0});
        }
    }
    ///////////////////////карточка главная стр внизу
    {
        let btn=document.getElementById('maincard2');
        let rect=btn.getBoundingClientRect();
        if ((((rect.top)<document.documentElement.clientHeight)&&rect.top>0)||((rect.bottom>0)&&(((rect.bottom)<document.documentElement.clientHeight)))){
            $("#yui-34").animate({left:'0vmin'},{duration: 500, queue:true, complete: ()=> $("#yui-34").clearQueue('fx')});
            $("#videopromo2").animate({left:'0vmin'},{duration: 500, queue:true, complete: ()=> $("#videopromo2").clearQueue('fx')});
        }
        else {
            $("#yui-34").animate({left:"60vmin"},{duration: 0});
            $("#videopromo2").animate({left:'-60vmin'},{duration: 0});
        }
    }
    //////////////////главная панель навигации
    {
        const scrollselector= store.getState().mainpage.scroll;
        let nav=document.getElementById('navmainid');
        if (!(nav.classList.contains('hovertoppanel2'))&&!(nav.classList.contains('hovertoppanel1')))
            $("#navmainid").addClass("hovertoppanel2");
        if (scrollselector.curscroll > scrollselector.oldscroll){
            $("#navmainid").removeClass("hovertoppanel2");
            $("#navmainid").addClass("hovertoppanel1");
        }
        else if (scrollselector.curscroll < scrollselector.oldscroll) {
            $("#navmainid").removeClass("hovertoppanel1");
            $("#navmainid").addClass("hovertoppanel2");
        }
    }
}

function* sagaWorker() {
    yield put(exampleAsyncAction())  //call чтобы вызвать ф-цию которая промис возвращает, all -запуск многих call как промис олл, race, fork
}
