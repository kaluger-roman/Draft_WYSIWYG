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
import {FontsMenuItem} from "../MenuItemsCollection/FontsMenuItem";
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import TextField from "@material-ui/core/TextField";
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import {inlineStyleMap} from "../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import {AlertDialogSlide} from "../AuxiliaryComps/AlertDialog";
import {useSelector} from "react-redux";



export const FontSizesListMenuItems = React.memo((props) => {
    let {onToggle, currentStyle, shouldMenuSelectedItemUpdate}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let [selectedFontSize, setSelectedFontSIze] = React.useState(null);
    let [isAlertShown, setIsAlertShown] = React.useState(false);
    let [isInputFocused, setIsInputFocused] = React.useState(false);
    //const basicUnitOfFontSizeInVmax=useSelector((state)=>state.Draft.UnitOfFontSizeInVmax);

    const handleAlertOpen = () => {
        setIsAlertShown(true);
    };

    const handleAlertClose = () => {
        setIsAlertShown(false);
    };
    let handleConfirmUserInput=useCallback(()=>{
        let input=document.getElementById('FONT_SIZE_TEXT_FIELD_INPUT_CONSTRUCTOR');
        input.blur();
        if(!isNaN(+(input.value)) && input.value>1 && input.value<100){
            let styleName=REGEXP_FONT_SIZE_SUFFIKS.slice(1)+(+(input.value)).toFixed(2);
            if (!inlineStyleMap.hasOwnProperty(styleName)){
                inlineStyleMap[styleName]={
                    fontSize:`${ (+(input.value)).toFixed(1)*basicUnitOfFontSizeInVmax}vmax`,
                }
            }
            saveSelectionStateActionWrapper(onToggle)(null, styleName, REGEXP_FONT_SIZE_SUFFIKS);
        }
        else{
            handleAlertOpen();
        }
    },[/*basicUnitOfFontSizeInVmax*/]);

    let regexp = new RegExp(REGEXP_FONT_SIZE_SUFFIKS);
    let newFontSize=currentStyle.toArray().find((value=>regexp.test(value)));

    let ret = useMemo(()=>{
        let localret=[];
        for (let type in FONT_SIZE_STYLES) {
            localret.push(
                <FontsMenuItem
                    key={type}
                    selected={currentStyle.has(type)}
                    disabled={currentStyle.has(type)}
                    onMouseDown={(e)=>{
                        if (!e.target.disabled)
                            saveSelectionStateActionWrapper(onToggle)(null, type, REGEXP_FONT_SIZE_SUFFIKS);
                    }}
                    type={FONT_SIZE_STYLES.type}>
                    <ListItemIcon>
                        <CreateOutlinedIcon fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primary={`${type.slice(REGEXP_FONT_SIZE_SUFFIKS.length-1)}`}/>
                </FontsMenuItem>
            )
        }
        return localret;
    },[selectedFontSize/*,basicUnitOfFontSizeInVmax*/]);
    let inputSize=useMemo(()=>{
        const useStyles = {
            root: {
                '& > *': {
                    width: '25ch',
                },
            },
        };
        return(
            <form
                className={useStyles.root} style={{display: 'flex'}}
                onSubmit={(e)=>{e.preventDefault(); handleConfirmUserInput()}}
                noValidate autoComplete="off"
            >
                <TextField onMouseDown={(e)=>{e.target.focus()}}
                           onFocus={()=>setIsInputFocused(true)}
                           onBlur={(e)=>{ saveSelectionStateActionWrapper()(e); setIsInputFocused(false)}}
                           onKeyDown={(e)=>{
                               e.stopPropagation();}}
                           id='FONT_SIZE_TEXT_FIELD_INPUT_CONSTRUCTOR'
                           variant="filled"
                           value={isInputFocused?undefined:selectedFontSize?selectedFontSize.slice(REGEXP_FONT_SIZE_SUFFIKS.length-1):undefined}
                />
                <div>
                <ListItemIcon>
                    <CheckCircleTwoToneIcon onMouseDown={(e)=>{handleConfirmUserInput()}} fontSize="default"/>
                </ListItemIcon>
                <ListItemIcon>
                    <CancelTwoToneIcon onMouseDown={(e)=>{document.getElementById('FONT_SIZE_TEXT_FIELD_INPUT_CONSTRUCTOR').blur()}} fontSize="default"/>
                </ListItemIcon>
                </div>
            </form>
        )

    },[selectedFontSize, isInputFocused,handleConfirmUserInput/*,basicUnitOfFontSizeInVmax*/]);


    if ((newFontSize!==selectedFontSize)&&(shouldMenuSelectedItemUpdate)) {
        setSelectedFontSIze(newFontSize);
    }
    return (
        <React.Fragment>
            <AlertDialogSlide/>
            {inputSize}
            {ret}
            <AlertDialogSlide headermessage={'Некорректный ввод'}
                                            message={'введите адекватные данные между 1 и 100'}
                                            open ={isAlertShown}
                                            handleClose={()=>saveSelectionStateActionWrapper(()=>handleAlertClose())()}/>
        </React.Fragment>
    );
});