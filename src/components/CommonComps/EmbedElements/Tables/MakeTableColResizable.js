import {getParsedTable, transposeMatrix} from "./GetParsedTableCheerIO";
import * as $ from "jquery";
import {compareArraysDeep} from "./TableUtils";

let MakeTableColResizableCashedParsed=undefined;
export const MakeTableColResizable=(tableID)=>{
    let parsed=getParsedTable(document.getElementById(tableID));//возвращает массив массивов id колонок

    ///////////////////Мемоизация
    if (MakeTableColResizableCashedParsed && compareArraysDeep(MakeTableColResizableCashedParsed, parsed)){
        return
    }
    else {
        MakeTableColResizableCashedParsed=parsed;
    }
    /////////////////
    let transposedParsed=transposeMatrix(parsed);

    let allCellsID=Array.from(new Set(parsed.flat(1)));

    allCellsID.filter((cellID)=>!parsed[parsed.length-1].includes(cellID)).forEach((id)=>{//,отрезаем последнюю она невидимая
        let alsoResize=[];
        let nextColumn=[];

        let rightIndexInRow=transposedParsed.find((row)=>row.includes(id)).lastIndexOf(id);

        for (let i=0; i<transposedParsed.length;i++){
            let alsoResizeCandidate=transposedParsed[i][rightIndexInRow];
            if (alsoResizeCandidate!==transposedParsed[i][rightIndexInRow+1]){
                alsoResize.push('#'+transposedParsed[i][rightIndexInRow]);
                nextColumn.push('#'+transposedParsed[i][rightIndexInRow+1])
            }
        }

        let nextColFirst,minWidthNextCol,widthNextCol, minWidthCurCol,allowedMaxWidthCur, alsoResizeJQAr, nextColJQAr,widthCurCol,allowedMinWidthCur ;
        try {$('#'+id ).resizable( "destroy" );}
        catch (e) {}
        $('#'+id ).resizable({
            handles: "e",
            alsoResize:alsoResize.join(','),
            start: function(event, ui) {
                nextColFirst=$(`${nextColumn[0]}`);

                minWidthNextCol= parseFloat(nextColFirst.css('minWidth'))||0;
                minWidthCurCol= parseFloat($(this).css('minWidth'));
                widthNextCol=parseFloat(nextColFirst.css('width'))||0;
                widthCurCol=parseFloat($(this).css('width'))||0;

                alsoResizeJQAr=$(`${alsoResize.join(',')}`);
                nextColJQAr=$(`${nextColumn.join(',')}`);

                allowedMaxWidthCur=$(this)[0].offsetWidth-minWidthNextCol+ nextColFirst[0].offsetWidth;

                let minOfAlsoResWidth=Math.min(...Array.from(alsoResizeJQAr).map((el)=>el.offsetWidth));
                allowedMinWidthCur=widthCurCol-(minOfAlsoResWidth)+minWidthCurCol;
                $( this ).resizable( "option", "maxWidth", allowedMaxWidthCur );
                $( this ).resizable( "option", "minWidth", allowedMinWidthCur );

                nextColJQAr.css("maxWidth",(allowedMaxWidthCur)+"px");
            },
            resize: function(event, ui)
            {
                let {originalSize, size}=ui;
                let difWidth=size.width-originalSize.width-((parseFloat($(this).css("border-left-width"))||0)+(parseFloat($(this).css("border-right-width"))||0));//вычитать поправку на ширину border

                if(ui.size.width>allowedMaxWidthCur){
                    nextColJQAr.css("width",(minWidthNextCol)+"px");
                }
                else {
                    nextColJQAr.css("width",(widthNextCol-difWidth)+"px");
                }

            },
            stop: function( event, ui ) {
                nextColJQAr.css("maxWidth", 'unset');
            },
        });
    });
};

