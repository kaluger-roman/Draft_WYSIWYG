import {A4_Page_PAPER} from "../../../CommonComps/Service&SAGA/PageSizeConstants";
import {initialUnitOfFontSizeInVmax} from "../../../../redux/Reducers/DraftEditorReducer";



export const UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE=(UnitOfFontSizeInVmax=initialUnitOfFontSizeInVmax)=>{
    FONT_SIZE_STYLES= {
        FONT_SIZE_5:{
            fontSize:`${5*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_6:{
            fontSize:`${6*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_7:{
            fontSize:`${7*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_8:{
            fontSize:`${8*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_9:{
            fontSize:`${9*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_10:{
            fontSize:`${10*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_11:{
            fontSize:`${11*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_12:{
            fontSize:`${12*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_14:{
            fontSize:`${14*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_16:{
            fontSize:`${16*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_18:{
            fontSize:`${18*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_20:{
            fontSize:`${20*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_24:{
            fontSize:`${24*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_28:{
            fontSize:`${28*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_32:{
            fontSize:`${32*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_36:{
            fontSize:`${36*UnitOfFontSizeInVmax}vmax`
        },
        FONT_SIZE_40:{
            fontSize:`${40*UnitOfFontSizeInVmax}vmax`
        }
    };
    return FONT_SIZE_STYLES;
};

UPDATE_FONT_SIZE_STYLES_CORRECT_TYPOGRAPHY_SIZE();
export let FONT_SIZE_STYLES;

