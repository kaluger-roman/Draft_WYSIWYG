import React, {useContext, useMemo} from "react";
import {DraftMainContext} from "../Service&SAGA/Contexts";
import {
    REGEXP_COLOR_SUFFIKS,
} from "../../styles/ConstructorStyles/DraftStyles/RegexpForStyleSuffiks";
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
        const styleName=REGEXP_COLOR_SUFFIKS.slice(1)+color.hex;
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
                onChangeComplete={ handleChangeComplete }
            />
            <SketchPicker color={ selectedColor}
                          onChangeComplete={ handleChangeComplete }/>
        </React.Fragment>
    );
});