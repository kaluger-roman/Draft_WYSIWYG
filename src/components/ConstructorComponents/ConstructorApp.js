import React, {useEffect} from 'react';
import ChangeLocationSubscriberHOC from "../HOCS/ChangeLocationSubscriberHOC";
import {useDispatch, useSelector} from "react-redux";
import HelpMessanging from "../CommonComps/HelpMessanging";
import * as St from './../styles/ConstructorStyles/ConstructorPageStyles.module.css'
import {RichTextEditor} from "./RichTextEditor";

function ConstructorApp() {
    const dispatch = useDispatch();
    return (
        <div className={` ${St.ConstructorPage} `}>
            <RichTextEditor/>
        </div>
    );
}

export default ChangeLocationSubscriberHOC(ConstructorApp);