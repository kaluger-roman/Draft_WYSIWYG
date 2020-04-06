import React from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from "react-redux";

export default function FunctionalCompDefault(props) {
    const dispatch=useDispatch();//dispatch(exampleAyncAction())
    const selector=useSelector((state)=>{
        return state.exinit1
    });
    return(
        <React.Fragment>
            <div>
                дефолтный
            </div>
        </React.Fragment>
    )
}