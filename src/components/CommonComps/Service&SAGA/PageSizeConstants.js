//все в миллиметрах
export const basicFontSizeUnitInMM=0.3759;
export const basicFontSizeUnitInCM=0.03759;

export const VERTICAL_ORIENTATION_PAGE_CONST='VERTICAL_ORIENTATION_PAGE_CONST';
export const HORIZONTAL_ORIENTATION_PAGE_CONST='HORIZONTAL_ORIENTATION_PAGE_CONST';

export const UnitOfFontSizePX = 4 / 3;//pt=4/3px, =0.376mm реальных    //источник истины, экранный размер пункта шрифта, непоколебимыйЮ колебать только масштабом внешнего элемента

const A4_Page_PAPER={
    [VERTICAL_ORIENTATION_PAGE_CONST]:{
        width:210,
        height:297,
    },
    [HORIZONTAL_ORIENTATION_PAGE_CONST]:{
        width:297,
        height:210,
    },
    name:'A4'
};
const A5_Page_PAPER={
    [VERTICAL_ORIENTATION_PAGE_CONST]:{
        width:148,
        height:210,
    },
    [HORIZONTAL_ORIENTATION_PAGE_CONST]:{
        width:210,
        height:148,
    },
    name:'A5'
};
export let Custom_Page_PAPER={
    [VERTICAL_ORIENTATION_PAGE_CONST]:{
        width:undefined,
        height:undefined,
    },
    [HORIZONTAL_ORIENTATION_PAGE_CONST]:{
        width:undefined,
        height:undefined,
    },
    name:'Custom'
};
export const LIST_OF_COMMON_PAPER_TYPES=[A4_Page_PAPER,A5_Page_PAPER];
