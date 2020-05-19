import React, {useCallback, useContext, useMemo} from "react";
import {DraftMainContext} from "../Service&SAGA/Contexts";
import {FONT_SIZE_STYLES} from "../../styles/ConstructorStyles/DraftStyles/FONT_SIZE_STYLES";
import {withStyles} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {
    REGEXP_COLOR_SUFFIKS,
    REGEXP_FONT_SIZE_SUFFIKS
} from "../../styles/ConstructorStyles/DraftStyles/RegexpForStyleSuffiks";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {FontsMenuItem, PageTypeMenuItem} from "../MenuItemsCollection/FontsMenuItem";
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import TextField from "@material-ui/core/TextField";
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import {inlineStyleMap} from "../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import {AlertDialogSlide} from "../AuxiliaryComps/AlertDialog";
import {useDispatch, useSelector} from "react-redux";
import {
    Custom_Page_PAPER, HORIZONTAL_ORIENTATION_PAGE_CONST,
    LIST_OF_COMMON_PAPER_TYPES,
    VERTICAL_ORIENTATION_PAGE_CONST
} from "../Service&SAGA/PageSizeConstants";
import NumericInput from "react-numeric-input";
import {DraftChangePaperOrientation, DraftChangePaperType} from "../../../redux/actions";
import * as St from "../../styles/ConstructorStyles/RichTextEditorStyle.module.css";

const StylesForNumericInput={
    wrap: {
        background: '#E2E2E2',
        boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
        padding: '2px 2.26ex 2px 2px',
        borderRadius: '6px 3px 3px 6px',
        fontSize: 32
    },
    input: {
        borderRadius: '4px 2px 2px 4px',
        color: '#988869',
        padding: '0.1ex 1ex',
        border: '1px solid #ccc',
        marginRight: 4,
        display: 'block',
        fontWeight: 100,
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)"
    },
    'input:focus' : {
        border: '1px inset #69C',
        outline: 'none'
    },
    arrowUp: {
        borderBottomColor: 'rgba(66, 54, 0, 0.63)'
    },
    arrowDown: {
        borderTopColor: 'rgba(66, 54, 0, 0.63)'
    }
};

export const PageOrientationPropsBlock = (props) => {
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let curOrientation = useSelector((state)=>state.Draft.orientation);
    let dispatch=useDispatch();


    const handleClickChangePaperType=(orientation)=>{
        dispatch(DraftChangePaperOrientation(orientation));
    };

    /*const handleClickOnInput=(e)=>{
        const editorContainerWithPages=document.querySelector(`.${St.ContainerForPagesAndEditor}`)
        const editorScrollTopBefore=editorContainerWithPages.scrollTop;
        e.target.focus();
        e.target.select()
        editorContainerWithPages.scrollTop=editorScrollTopBefore;
    };*/


    return (
        <React.Fragment>
            <PageTypeMenuItem
                key={VERTICAL_ORIENTATION_PAGE_CONST}
                selected={curOrientation===VERTICAL_ORIENTATION_PAGE_CONST}
                disabled={curOrientation===VERTICAL_ORIENTATION_PAGE_CONST}
                onMouseDown={(e)=>{
                    if (!e.target.disabled)
                        handleClickChangePaperType(VERTICAL_ORIENTATION_PAGE_CONST);
                }}
            >
                <ListItemIcon>
                    <CreateOutlinedIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary={`${VERTICAL_ORIENTATION_PAGE_CONST}`}/>
            </PageTypeMenuItem>
            <PageTypeMenuItem
                key={HORIZONTAL_ORIENTATION_PAGE_CONST}
                selected={curOrientation===HORIZONTAL_ORIENTATION_PAGE_CONST}
                disabled={curOrientation===HORIZONTAL_ORIENTATION_PAGE_CONST}
                onMouseDown={(e)=>{
                    if (!e.target.disabled)
                        handleClickChangePaperType(HORIZONTAL_ORIENTATION_PAGE_CONST);
                }}
            >
                <ListItemIcon>
                    <CreateOutlinedIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary={`${HORIZONTAL_ORIENTATION_PAGE_CONST}`}/>
            </PageTypeMenuItem>
        </React.Fragment>
    );
};