import React, {useEffect} from 'react';
import ChangeLocationSubscriberHOC from "../HOCS/ChangeLocationSubscriberHOC";
import {useDispatch, useSelector} from "react-redux";
import HelpMessanging from "../CommonComps/HelpMessanging";
import * as St from './../styles/ConstructorStyles/ConstructorPageStyles.module.css'

function ConstructorApp() {
    const dispatch = useDispatch();
    return (
        <div className={`container-fluid p-0 m-0 ${St.ConstructorPage}`}>

        </div>
    );
}

export default ChangeLocationSubscriberHOC(ConstructorApp);