import React, {useContext, useMemo} from "react";
import {DraftMainContext} from "../Contexts";
import {FONT_FAMILIES_STYLES} from "../../styles/ConstructorStyles/DraftStyles/FONT_FAMILIES_STYLES";
import {withStyles} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {
    REGEXP_COLOR_SUFFIKS,
    REGEXP_FONT_FAMILY_SUFFIKS, default as REGEXP_SUFS
} from "../../styles/ConstructorStyles/DraftStyles/RegexpForStyleSuffiks";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {FontsMenuItem} from "../MenuItemsCollection/FontsMenuItem";
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import { SketchPicker, CirclePicker } from 'react-color';
import {inlineStyleMap} from './../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS'


export const ColorPickerListMenuItems = React.memo((props) => {
    let [selectedColor, setSelectedColor] = React.useState('#fff');
    let {onToggle, currentStyle, shouldMenuSelectedItemUpdate}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);

    if(shouldMenuSelectedItemUpdate){
        const arrOfStyles=currentStyle.toArray();
        let regexp = new RegExp(REGEXP_COLOR_SUFFIKS);
        let colorToSetState=arrOfStyles.find((value)=>{
            if (regexp.test(value))
                return true
        });
        if (colorToSetState) {
            colorToSetState = colorToSetState.slice(REGEXP_COLOR_SUFFIKS.length);
            if (selectedColor !== colorToSetState)
                setSelectedColor(colorToSetState)
        }
    }



    let handleChangeComplete = (color) => {
        setSelectedColor( color );
        const styleName='COLOR_'+color.hex;
        if (!inlineStyleMap.hasOwnProperty(styleName)){
            inlineStyleMap[styleName]={
                color: color.hex,
            }
        }
        saveSelectionStateActionWrapper(onToggle)(null, styleName, REGEXP_COLOR_SUFFIKS);
    };

    return (
        <React.Fragment>
            <CirclePicker color={ selectedColor}
                onChangeComplete={ handleChangeComplete }/>
            <SketchPicker color={ selectedColor}
                          onChangeComplete={ handleChangeComplete }/>
        </React.Fragment>
    );
});