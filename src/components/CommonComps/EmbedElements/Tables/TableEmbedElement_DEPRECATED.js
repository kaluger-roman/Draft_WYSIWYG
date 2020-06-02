import React, {createRef, useEffect, useMemo, useRef} from 'react';
import {CompositeDecorator, Editor, EditorState} from "draft-js";
import * as $ from 'jquery';
import 'jquery-ui';
import {useSelector} from "react-redux";


export const CREATED_TABLES={};


class TableEmbedCell extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = editorState =>this.setState({editorState});
        this.DomEditorRef = createRef();
        this.tableID=props.tableID;
        this.parentEL=$(`#RichEditoreditor_>.DraftEditor-root`);
        this.state = {
            editorState: EditorState.createEmpty(),
            width:this.parentEL.width()/(CREATED_TABLES[this.tableID].columns)-props.CONFIG_TABLE_PARAMS.borderCellWidth,
        };
    }

    componentDidMount() {
        const setStateWidth=(newWidth)=>this.setState((prev,props)=>{return {...prev, width:newWidth}});
        setStateWidth($(this.selector)[0].offsetWidth);

        let CONFIG_TABLE_PARAMS=this.CONFIG_TABLE_PARAMS;

        let alsoResize=[];
        let nextColumn=[];

        for (let i=1; i<=this.rowCount;i++){
            alsoResize.push(`#${this.tableID}_${i}_${this.columnNumber}`);

            if (this.columnNumber < this.colCount)
                 nextColumn.push(`#${this.tableID}_${i}_${+this.columnNumber + 1}`)
        }

        let nextColFirst,minWidthNextCol,widthNextCol, minWidthCurCol,allowedMaxWidthCur, alsoResizeJQAr, nextColJQAr ;
        let tableContainerEl=$(`#TableContainer${this.tableID}`);
        let parentEL=this.parentEL;

        $(this.selector).resizable({
            handles: "e",
            start: function() {
                nextColFirst=$(`${nextColumn[0]}`);

                minWidthNextCol= parseFloat(nextColFirst.css('minWidth'))||0;
                minWidthCurCol= parseFloat($(this).css('minWidth'));
                widthNextCol=parseFloat(nextColFirst.css('width'))||0;

                allowedMaxWidthCur=$(this)[0].offsetWidth-minWidthNextCol+(nextColFirst[0] ? nextColFirst[0].offsetWidth
                                    : (parentEL[0].offsetWidth- tableContainerEl[0].offsetWidth-tableContainerEl[0].offsetLeft-parseFloat(parentEL.css('paddingRight'))));

                alsoResizeJQAr=$(`${alsoResize.join(',')}`);
                nextColJQAr=$(`${nextColumn.join(',')}`);

                alsoResizeJQAr.css("maxWidth",(allowedMaxWidthCur)+"px");
                nextColJQAr.css("maxWidth",(allowedMaxWidthCur)+"px");
            },
            resize: function(event, ui)
            {
                let {originalSize, size}=ui;
                    let difWidth=size.width-originalSize.width-((parseFloat($(this).css("border-left-width"))||0)+(parseFloat($(this).css("border-right-width"))||0));//вычитать поправку на ширину border
                    if((nextColumn.length>0))
                             nextColJQAr.css("width",(widthNextCol-difWidth)+"px");

                    alsoResizeJQAr.css("width",size.width+"px");
            },
            stop: function( event, ui ) {
                if(ui.size.width>allowedMaxWidthCur)
                    alsoResizeJQAr.css("width",(allowedMaxWidthCur)+"px");

                if(ui.size.width<parseFloat(CONFIG_TABLE_PARAMS.minCellWidth))
                    nextColJQAr.css("width",(allowedMaxWidthCur)+"px");

                alsoResizeJQAr.css("maxWidth", 'unset');
                nextColJQAr.css("maxWidth", 'unset');

                setStateWidth($(this)[0].offsetWidth);
            },
        });
    }

    render() {
        let keyID =this.keyID=this.props.keyID;
        let CONFIG_TABLE_PARAMS=this.CONFIG_TABLE_PARAMS=this.props.CONFIG_TABLE_PARAMS;
        let selector=this.selector=`#${this.keyID}`;
        let columnNumber=this.columnNumber=this.keyID.match(/\d+$/)[0];
        let rowNumber=this.rowNumber=this.keyID.match(/_(\d+)_\d+$/)[1];
        let rowCount=this.rowCount=CREATED_TABLES[this.tableID].rows;
        let colCount=this.colCount=CREATED_TABLES[this.tableID].columns;
        let groupJqEl=this.groupJqEl;
        let parentElW=this.parentEL.width();
        let PartWeight=this.PartWeight;

        let stateWidth=this.state.width;

        return(
            <div id={keyID} style={{borderStyle: 'solid', borderColor:`#000`, minHeight:`${CONFIG_TABLE_PARAMS.minCellHeight}`, minWidth:`${CONFIG_TABLE_PARAMS.minCellWidth}`,
                width:`${stateWidth}px`,position:"relative", boxSizing: "border-box", height:'100%',
                borderWidth:`${+rowNumber===1?CONFIG_TABLE_PARAMS.borderCellWidth:0}px ${CONFIG_TABLE_PARAMS.borderCellWidth}px ${CONFIG_TABLE_PARAMS.borderCellWidth}px ${+columnNumber===1?CONFIG_TABLE_PARAMS.borderCellWidth:0}px`
            }}
                 onMouseDown={(e)=>e.stopPropagation()}
                 onClick={()=>this.DomEditorRef.current.focus()}
            >
                <Editor
                    editorState={this.state.editorState}
                    onChange={(state)=>this.onChange(state)}
                    ref={this.DomEditorRef}
                />
            </div>
        )
    }
}


export const TableEmbedElement_DEPRECATED=(props)=>{
    const {block, contentState} = props;
    const {toggleEditorReadOnly}=props.blockProps;
    const {tableID} = contentState.getEntity(block.getEntityAt(0)).getData();
    const {rows, columns,CONFIG_TABLE_PARAMS}=CREATED_TABLES[tableID];
    let pageFields=useSelector((state)=>state.Draft.pageFields);


    const ret = useMemo(()=>{
        let localret=[];
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= columns; j++) {

                localret.push(
                    <TableEmbedCell CONFIG_TABLE_PARAMS={CONFIG_TABLE_PARAMS} pageFields={pageFields} tableID={tableID} keyID={`${tableID}_${i}_${j}`} key={`${tableID}_${i}_${j}`} />
                )
            }
        }
        return [localret]
    },[rows, columns,pageFields]);

    useEffect(()=>{
        let groupCellSelector=`#GroupOfCellsTable${tableID}`;
        let jqEl= $(groupCellSelector);

        let firstColumn=[];
            for (let i=1; i<=columns;i++){
                firstColumn.push(`#${tableID}_${i}_${1}`)
            }
            let startWidth,widthFirstCol,firstColFirst,minWidthFirstCol, minAllowWidth,maxAllowWidth,maxFirstColAllowWidth,parentEditorRect,jqElRect, startLeft,diff;
            let parentEL=$(`#RichEditoreditor_>.DraftEditor-root`);
            let tableContainerEl=$(`#TableContainer${tableID}`);


        jqEl.resizable({
            handles:  "w",
            start: function( event, ui ) {

                startWidth=parseFloat(jqEl.css('width'));
                startLeft=parseFloat(jqEl.css('left'));
                firstColFirst=$(`${firstColumn[0]}`);
                widthFirstCol=parseFloat(firstColFirst.css('width'));
                minWidthFirstCol=parseFloat(firstColFirst.css('minWidth'));

                minAllowWidth=startWidth-widthFirstCol+minWidthFirstCol;
                maxAllowWidth=startWidth+(jqEl[0].offsetLeft-parseFloat(parentEL.css('paddingLeft')));
                maxFirstColAllowWidth=maxAllowWidth-minAllowWidth+minWidthFirstCol;

                jqEl.css("minWidth",(minAllowWidth)+"px");
                jqEl.css("maxWidth",(maxAllowWidth)+"px");
                $(`${firstColumn.join(',')}`).css("maxWidth",(maxFirstColAllowWidth)+'px');

            },
            resize: function(event, ui)
            {
                $(this).css('width', (ui.size.width/*+2*CONFIG_TABLE_PARAMS.borderCellWidth*/)+'px');
                if(ui.size.width<minAllowWidth){
                    $(this).css('left', startLeft+(startWidth-minAllowWidth));
                }
                if(ui.size.width>maxAllowWidth){
                    $(this).css('left', (startLeft-(maxAllowWidth-startWidth))+'px');
                    $(this).css('width', maxAllowWidth+'px');
                }
                diff=ui.size.width-startWidth;
                $(`${firstColumn.join(',')}`).css("width", (widthFirstCol+diff/*+2*CONFIG_TABLE_PARAMS.borderCellWidth*/)+'px');

            },
            stop: function( event, ui ) {
                let firstColumnRet= $(`${firstColumn.join(',')}`);
                if (ui.size.width>=maxAllowWidth){
                    firstColumnRet.css("width",(maxFirstColAllowWidth)+'px');
                }
                jqEl.css("width",'auto');
                jqEl.css("minWidth",'unset');
                jqEl.css("maxWidth",'unset');
                firstColumnRet.css("maxWidth",'unset');

            }
        })


    },[]);

    return(
        <div id={`TableContainer${tableID}`} style={{width: "min-content", maxWidth:'100%',margin:'0'}}>
            <div  id={`GroupOfCellsTable${tableID}`} onFocus={()=> {
                toggleEditorReadOnly(true)
            }
            }
                 onBlur={()=>toggleEditorReadOnly(false)}
                 style={{display:"grid", gridTemplateColumns: `repeat(${columns}, fit-content(100%)`,
                      margin:'0px', position: "relative",
                 }}>
                {
                   ret
                }
            </div>
        </div>
    )
};