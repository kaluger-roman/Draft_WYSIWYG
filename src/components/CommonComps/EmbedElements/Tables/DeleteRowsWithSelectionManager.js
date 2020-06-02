import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {useDispatch, useSelector} from "react-redux";
import React, {useMemo} from "react";
import {
    DraftNeedDeleteRowsWithFULLSelection,
    DraftNeedDeleteRowsWithSelection,
    DraftNeedMergeTableCells
} from "../../../../redux/actions";
import Button from "@material-ui/core/Button";

export const DeleteRowsWithSelectionManager=()=>{
    const curSelectedTableCells=useSelector((state)=>state.Draft.selectedTableCells);
    const dispatch=useDispatch();

    let isActive=useMemo(()=>{
        if (curSelectedTableCells===undefined)
            return false;

        return true;
    },[curSelectedTableCells])
    const onDeleteRowsHandler=()=>{
        dispatch(DraftNeedDeleteRowsWithSelection(true));
    };
    return(
        <Button
            onMouseDown={(e)=>onDeleteRowsHandler()}
            disabled={!isActive}
            variant="contained"
            color="secondary"
            startIcon={<DeleteForeverIcon />}
        >
            Удалить частично выделенные строки
        </Button>
    )
}
export const DeleteRowsWithFULLSelectionManager=()=>{
    const curSelectedTableCells=useSelector((state)=>state.Draft.selectedTableCells);
    const dispatch=useDispatch();

    let isActive=useMemo(()=>{
        if (curSelectedTableCells===undefined)
            return false;

        return true;
    },[curSelectedTableCells])
    const onDeleteRowsHandler=()=>{
        dispatch(DraftNeedDeleteRowsWithFULLSelection(true));
    };
    return(
        <Button
            onMouseDown={(e)=>onDeleteRowsHandler()}
            disabled={!isActive}
            variant="contained"
            color="secondary"
            startIcon={<DeleteForeverIcon />}
        >
            Удалить полностью выделенные строки
        </Button>
    )
}