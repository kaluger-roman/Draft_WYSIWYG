import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {ChangePage} from "./../../redux/actions";
import { useRouteMatch } from "react-router-dom";


export default (WrappedComp)=> {
    return (props) => {
        let dispatch = useDispatch();
        let {path} = useRouteMatch();
        useEffect(() => {
            dispatch(ChangePage(path));
        });
        return (
            <WrappedComp {...props}/>
        );
    }
}