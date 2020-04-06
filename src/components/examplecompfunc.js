import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'
import {exampleAction} from "../redux/actions";
const FunctionalComp =({exampleprops,exampleprops1}) =>{
    return(
        <React.Fragment>
            <div>
                фУНЦИОНАЛЬНЫЙ
                {exampleprops}
                {exampleprops1}
            </div>
        </React.Fragment>
    )
};
const mapStateToProps=state=>{
    return{
        exampleprops:state.exinit,
        exampleprops1:state.exinit1,
    }
};
const mapDispatchToProps={
    exampleAction,
};
export default connect(mapStateToProps,mapDispatchToProps)(FunctionalComp);