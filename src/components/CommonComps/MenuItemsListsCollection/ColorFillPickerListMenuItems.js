import React, {useContext, useMemo} from "react";
import {DraftMainContext} from "../Service&SAGA/Contexts";
import {
    REGEXP_COLOR_FILL_SUFFIKS,
} from "../../styles/ConstructorStyles/DraftStyles/RegexpForStyleSuffiks";
import { SketchPicker, CirclePicker } from 'react-color';
import {inlineStyleMap} from './../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS'


export const ColorFillPicker = React.memo((props) => {
    let [selectedColor, setSelectedColor] = React.useState('#fff');
    let {onToggle, currentStyle, shouldMenuSelectedItemUpdate}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);

    if(shouldMenuSelectedItemUpdate){
        const arrOfStyles=currentStyle.toArray();
        let regexp = new RegExp(REGEXP_COLOR_FILL_SUFFIKS);
        let colorToSetState=arrOfStyles.find((value)=>{
            if (regexp.test(value))
                return true
        });
        if (colorToSetState) {
            colorToSetState = colorToSetState.slice(REGEXP_COLOR_FILL_SUFFIKS.length);
            if (selectedColor !== colorToSetState)
                setSelectedColor(colorToSetState)
        }
    }



    let handleChangeComplete = (color) => {
        setSelectedColor( color );
        const styleName=REGEXP_COLOR_FILL_SUFFIKS.slice(1)+color.hex;
        if (!inlineStyleMap.hasOwnProperty(styleName)){
            inlineStyleMap[styleName]={
                backgroundColor: color.hex,
            }
        }
        saveSelectionStateActionWrapper(onToggle)(null, styleName, REGEXP_COLOR_FILL_SUFFIKS);
    };

    return (
        <React.Fragment>
            <CirclePicker color={ selectedColor}
                onChangeComplete={ handleChangeComplete }
                colors={["#f44336", "#34DD78", "#9c27b0", "#00000000", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}

            />
            <SketchPicker color={ selectedColor}
                          onChangeComplete={ handleChangeComplete }/>
        </React.Fragment>
    );
});