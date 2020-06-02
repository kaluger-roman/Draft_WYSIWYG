import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {useDispatch, useSelector} from "react-redux";
import React, {useMemo} from "react";
import {
    DraftNeedDeleteColumnsWithFULLSelection,
    DraftNeedDeleteColumnsWithSelection,
    DraftNeedDeleteRowsWithFULLSelection,
    DraftNeedDeleteRowsWithSelection,
    DraftNeedMergeTableCells
} from "../../../../redux/actions";
import Button from "@material-ui/core/Button";

export const DeleteColsWithSelectionManager=()=>{
    const curSelectedTableCells=useSelector((state)=>state.Draft.selectedTableCells);
    const dispatch=useDispatch();

    let isActive=useMemo(()=>{
        if (curSelectedTableCells===undefined)
            return false;

        return true;
    },[curSelectedTableCells])
    const onDeleteColsHandler=()=>{
        dispatch(DraftNeedDeleteColumnsWithSelection(true));
    };
    return(
        <Button
            onMouseDown={(e)=>onDeleteColsHandler()}
            disabled={!isActive}
            variant="contained"
            color="secondary"
            startIcon={<DeleteForeverIcon />}
        >
            Удалить частично выделенные колонки
        </Button>
    )
}
export const DeleteColsWithFULLSelectionManager=()=>{
    const curSelectedTableCells=useSelector((state)=>state.Draft.selectedTableCells);
    const dispatch=useDispatch();

    let isActive=useMemo(()=>{
        if (curSelectedTableCells===undefined)
            return false;

        return true;
    },[curSelectedTableCells])
    const onDeleteColsHandler=()=>{
        dispatch(DraftNeedDeleteColumnsWithFULLSelection(true));
    };
    return(
        <Button
            onMouseDown={(e)=>onDeleteColsHandler()}
            disabled={!isActive}
            variant="contained"
            color="secondary"
            startIcon={<DeleteForeverIcon />}
        >
            Удалить полностью выделенные колонки
        </Button>
    )
}