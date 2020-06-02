import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField/TextField";
import React, {useEffect, useMemo, useState} from "react";
import MergeTypeIcon from '@material-ui/icons/MergeType';
import NumericInput from "react-numeric-input";
import {StylesForNumericInput} from "../../PropsBlocks/FieldsPropsBlock";
import {useDispatch, useSelector} from "react-redux";
import {DraftConfigSplitTableCells, DraftNeedSplitTableCells} from "../../../../redux/actions";



export const SplitTableCellsManager=(props)=>{
    let [values, setValues]=useState({cols:1, rows:1});
    const curSelectedTableCells=useSelector((state)=>state.Draft.selectedTableCells);
    const dispatch=useDispatch();
    let isActive=useMemo(()=>{
        if (curSelectedTableCells===undefined)
            return false;
        return curSelectedTableCells.selectedCells.length===1;
    },[curSelectedTableCells]);

    useEffect(()=>{
        let multiplicity=isActive?curSelectedTableCells.selectedCells[0].colSpan:1;
        setValues({...values,cols:multiplicity})
    },[curSelectedTableCells]);


    function handlerChangeInput(newVal,strval,inputObj){
        let newState={...values,[inputObj.title]:newVal};
        setValues(newState);
        dispatch(DraftConfigSplitTableCells(newState));
    }

    return(
        <React.Fragment>
            <Button
                variant="contained"
                color="default"
                startIcon={<MergeTypeIcon />}
                disabled={!isActive}
                onClick={()=>dispatch(DraftNeedSplitTableCells(true))}
            >
                Разделить ячейку
            </Button>
            <form  noValidate autoComplete="off">
                <NumericInput
                    onFocus={(e)=>{e.preventDefault(); e.stopPropagation(); e.target.blur()}}
                    title='cols'
                    onChange={(val,strval,inputObj)=>handlerChangeInput(val,strval,inputObj)}
                    value={values.cols}
                    precision={0}
                    size={6}
                    step={isActive?curSelectedTableCells.selectedCells[0].colSpan:1}
                    mobile={false}
                    min={isActive?curSelectedTableCells.selectedCells[0].colSpan:1}
                    max={isActive?curSelectedTableCells.selectedCells[0].colSpan*6:20}
                    style={StylesForNumericInput}
                />
                <div>{isActive?'должно быть кратно '+curSelectedTableCells.selectedCells[0].colSpan:'fffff'}</div>
                <NumericInput
                    onFocus={(e)=>{e.preventDefault(); e.stopPropagation(); e.target.blur()}}
                    title='rows'
                    onChange={(val,strval,inputObj)=>handlerChangeInput(val,strval,inputObj)}
                    value={values.rows}
                    precision={0}
                    size={6}
                    step={isActive?curSelectedTableCells.selectedCells[0].rowSpan:1}
                    mobile={false}
                    min={isActive?curSelectedTableCells.selectedCells[0].rowSpan:1}
                    max={isActive?curSelectedTableCells.selectedCells[0].rowSpan*6:20}
                    style={StylesForNumericInput}
                />
                <div>{isActive?'должно быть кратно '+curSelectedTableCells.selectedCells[0].rowSpan:'fffff'}</div>
            </form>
        </React.Fragment>
    )
};