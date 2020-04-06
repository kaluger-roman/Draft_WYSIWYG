import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { ExampleCompClass} from "./components/examplecomponent";
import FunctionalComp from "./components/examplecompfunc";
import FunctionalCompDefault from "./components/exampledefaultexportfunccomp";
import MainPanel from "./components/mainpanel";
import MainPageCarousel from "./components/carouselmainpage";
import Floor from "./components/floor";
import MainpageBlock1 from "./components/mainpageblock1";
import MainpageBlock2 from "./components/mainpageblock2";
import MainpageBlock3 from "./components/MainPageBlock3";
import MainPageBlock4 from "./components/MainPageBlock4";
import {useDispatch, useSelector} from "react-redux";
import {ScrollDownAction, ScrollUndefindAction, ScrollUpAction} from "./redux/actions";
import HelpMessanging from "./components/HelpMessanging";


function App() {
    const dispatch=useDispatch();


    useEffect(()=>{

        window.addEventListener('scroll', function f1() {
                //console.log('я скролю1');
                dispatch(ScrollUndefindAction());
                return function cleanup() {
                    window.removeEventListener('scroll',  f1);
                    //console.log('я скролю2');
                };
        }
        );
    });
  return (
    <div className="App container-fluid p-0 m-0" >
      <MainPanel/>
      <MainPageCarousel/>
      <MainpageBlock1/>
      <MainpageBlock3/>
      <MainpageBlock2/>
      <MainPageBlock4/>
      <Floor/>
      <HelpMessanging/>
    </div>
  );
}

export default App;
