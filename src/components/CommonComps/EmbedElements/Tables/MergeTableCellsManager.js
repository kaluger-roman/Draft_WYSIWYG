import Button from "@material-ui/core/Button";
import React, {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MergeTypeIcon from '@material-ui/icons/MergeType';
import {DraftNeedMergeTableCells} from "../../../../redux/actions";


export const InputMergeTableManage=(props)=>{
    const curSelectedTableCells=useSelector((state)=>state.Draft.selectedTableCells);
    const dispatch=useDispatch();

    let isActive=useMemo(()=>{
        if (curSelectedTableCells===undefined)
            return false;

        let {selectedCells, colLengthSpan,rowLengthSpan, parsed}=curSelectedTableCells;
        const square=colLengthSpan*rowLengthSpan;
        const flatArrayCellsParsed=parsed.flat(1);
        let countIn=0;
        selectedCells.forEach((cell)=>{
            countIn+=flatArrayCellsParsed.filter((parsedId)=>parsedId===cell.id).length;
        });
        return square===countIn;
    },[curSelectedTableCells])
    const onMergeHandler=()=>{
        dispatch(DraftNeedMergeTableCells(true));

    };
    return(
        <Button
            onMouseDown={(e)=>onMergeHandler()}
            disabled={!isActive}
            variant="contained"
            color="secondary"
            startIcon={<MergeTypeIcon />}
        >
            Объудинить ячейки
        </Button>
    )
};