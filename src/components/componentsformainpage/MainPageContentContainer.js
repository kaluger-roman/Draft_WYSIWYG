import MainPageCarousel from "./carouselmainpage";
import MainpageBlock1 from "./mainpageblock1";
import MainpageBlock3 from "./MainPageBlock3";
import MainpageBlock2 from "./mainpageblock2";
import MainPageBlock4 from "./MainPageBlock4";
import MainpageBlock5 from "./MainPageBlock5";
import ChangeLocationSubscriberHOC from "../HOCS/ChangeLocationSubscriberHOC";
import React from "react";

function MainPageContentContainer(props) {
    return (
        <div className='container-fluid p-0 m-0'>
            <MainPageCarousel/>
            <MainpageBlock1/>
            <MainpageBlock3/>
            <MainpageBlock2/>
            <MainPageBlock4/>
            <MainpageBlock5/>
        </div>
    )
}

export default ChangeLocationSubscriberHOC(MainPageContentContainer)