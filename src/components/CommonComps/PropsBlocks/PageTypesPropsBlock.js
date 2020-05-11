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
import {Custom_Page_PAPER, LIST_OF_COMMON_PAPER_TYPES} from "../Service&SAGA/PageSizeConstants";
import NumericInput from "react-numeric-input";
import {DraftChangePaperType} from "../../../redux/actions";

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

export const PageTypesPropsBlock = (props) => {
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let curPageType = useSelector((state)=>state.Draft.curPagePaperType);
    let [isAlertShown, setIsAlertShown] = React.useState(false);
    let [isInputFocused, setIsInputFocused] = React.useState(false);
    let dispatch=useDispatch();
    const handleAlertOpen = () => {
        setIsAlertShown(true);
    };

    const handleAlertClose = () => {
        setIsAlertShown(false);
    };

    const handleClickChangePaperType=(type)=>{
        dispatch(DraftChangePaperType(type));
    };

    let ret = useMemo(()=>{
        let localret=[];
        LIST_OF_COMMON_PAPER_TYPES.forEach((type => {
            localret.push(
                <PageTypeMenuItem
                    key={type.name}
                    selected={curPageType===type}
                    disabled={curPageType===type}
                    onMouseDown={(e)=>{
                        if (!e.target.disabled)
                            handleClickChangePaperType(type);
                    }}
                    >
                    <ListItemIcon>
                        <CreateOutlinedIcon fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primary={`${type.name}`}/>
                </PageTypeMenuItem>
            )
        }));

        return localret;
    },[curPageType]);

    let inputCustomPageType=/*useMemo*/(()=>{
        const useStyles = {
            root: {
                '& > *': {
                    width: '25ch',
                },
            },
        };
        return(
            <form
                className={useStyles.root} style={{/*display: 'flex',*/ backgroundColor:'#f862ff'}}
                onSubmit={(e)=>{e.preventDefault(); handleClickChangePaperType()}}
                noValidate autoComplete="off"
            >
                <div> Ширина
                <NumericInput
                    title='Width'
                    onClick={(e)=>{e.target.focus()}}
                    onFocus={()=>setIsInputFocused(true)}
                    onBlur={()=>setIsInputFocused(false)}
                    onChange={(val)=>{Custom_Page_PAPER.width=val}}
                    value={curPageType.width}
                    precision={0}
                    size={6}
                    step={1}
                    mobile={false}
                    min={0}
                    max={10000}
                    style={StylesForNumericInput}
                />
            </div>
                <div>Высота
                    <NumericInput
                        title='Height'
                        onClick={(e)=>{e.target.focus()}}
                        onFocus={()=>setIsInputFocused(true)}
                        onBlur={()=>setIsInputFocused(false)}
                        onChange={(val)=>{Custom_Page_PAPER.height=val}}
                        value={curPageType.height}
                        precision={0}
                        size={6}
                        step={1}
                        mobile={false}
                        min={0}
                        max={10000}
                        style={StylesForNumericInput}
                    />
                </div>
                <div>
                    <ListItemIcon>
                        <CheckCircleTwoToneIcon onMouseDown={(e)=>{handleClickChangePaperType(Custom_Page_PAPER)}} fontSize="default"/>
                    </ListItemIcon>
                   {/* <ListItemIcon>
                        <CancelTwoToneIcon onMouseDown={(e)=>{document.getElementById('FONT_SIZE_TEXT_FIELD_INPUT_CONSTRUCTOR').blur()}} fontSize="default"/>
                    </ListItemIcon>*/}
                </div>
            </form>
        )

    }/*,[selectedFontSize, isInputFocused,handleConfirmUserInput/!*,basicUnitOfFontSizeInVmax*!/]*/)();


    return (
        <React.Fragment>
            {inputCustomPageType}
            {ret}
            <AlertDialogSlide headermessage={'Некорректный ввод'}
                              message={'введите адекватные данные между 1 и 100'}
                              open ={isAlertShown}
                              handleClose={()=>saveSelectionStateActionWrapper(()=>handleAlertClose())()}/>
        </React.Fragment>
    );
};