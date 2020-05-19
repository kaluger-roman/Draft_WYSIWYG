import React, {createRef, useMemo, useRef} from 'react';
import {CompositeDecorator, Editor, EditorState} from "draft-js";
import * as $ from 'jquery';
import 'jquery-ui';


export const CREATED_TABLES={};

const CONFIG_TABLE_PARAMS={
    minCellWidth:'80px',
    minCellHeight:'30px',
    borderCellWidth:1,
};

class TableEmbedCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        };
        this.onChange = editorState =>{
            this.setState({editorState});
        };
        this.DomEditorRef = createRef();
        this.keyID=props.keyID;
        this.tableID=props.tableID;
    }

    componentDidMount() {
        let selector=`#${this.keyID}`;
        let columnNumber=this.keyID.match(/\d+$/)[0];
        let rowNumber=this.keyID.match(/_(\d+)_\d+$/)[1];

        let tableID=this.tableID;

        let rowCount=CREATED_TABLES[this.tableID].rows;
        let colCount=CREATED_TABLES[this.tableID].columns;

        let alsoResize=[];
        for (let i=1; i<=rowCount;i++){
            alsoResize.push(`#${this.tableID}_${i}_${columnNumber}`)
        }
        alsoResize=alsoResize.filter((value => value!==selector));

       /* let alsoResizeAsRow=[];
        for (let i=1; i<=colCount;i++){
            alsoResizeAsRow.push(`#${this.tableID}_${rowNumber}_${i}`)
        }
        alsoResizeAsRow=alsoResizeAsRow.filter((value => value!==selector));*/

        let nextColumn=[];
        if (columnNumber<colCount){
        for (let i=1; i<=rowCount;i++){
            nextColumn.push(`#${this.tableID}_${i}_${+columnNumber+1}`)
        }}

        let nextColFirst,minWidthNextCol,widthNextCol, minWidthCurCol ;
        let allowedMaxWidthCur;

        $(selector).resizable({
            handles: +columnNumber===1? " e, w": "e",
            start: function( event, ui ) {
                nextColFirst=$(`${nextColumn[0]}`);

                minWidthNextCol= parseFloat(nextColFirst.css('minWidth'))||0;
                minWidthCurCol= parseFloat($(selector).css('minWidth'));
                widthNextCol=parseFloat(nextColFirst.css('width'))||0;

                let curRect=$(selector)[0].getBoundingClientRect();
                let nextRect=(nextColFirst[0]||document.getElementById(`TableContainer${tableID}`).parentNode).getBoundingClientRect();

                allowedMaxWidthCur=(nextRect.right-curRect.left-minWidthNextCol)-4*CONFIG_TABLE_PARAMS.borderCellWidth;

                $(selector).css("maxWidth",(allowedMaxWidthCur)+"px");
                $(`${alsoResize.join(',')}`).css("maxWidth",(allowedMaxWidthCur)+"px");
                $(`${nextColumn.join(',')}`).css("maxWidth",(allowedMaxWidthCur)+"px");


            },
            resize: function(event, ui)
            {
                let {originalSize, size}=ui;
                    let difWidth=size.width-originalSize.width;
                    if((nextColumn.length>0)){
                        $(`${nextColumn.join(',')}`).css("width",(widthNextCol-difWidth)+"px");
                    }
                     $(`${alsoResize.join(',')}`).css("width",size.width+"px");

                  /*   $(`${alsoResizeAsRow.join(',')}`).css("height",size.height+"px");*/

            },
            stop: function( event, ui ) {
                $(selector).css("maxWidth",null);
                $(`${alsoResize.join(',')}`).css("maxWidth", null);
                $(`${nextColumn.join(',')}`).css("maxWidth", null);

             /*   $(selector).css("height",'auto');
                $(`${alsoResizeAsRow.join(',')}`).css("height",'auto');*/
            },
        });

    }

    render() {

        return(
            <div id={this.keyID} style={{border: `${CONFIG_TABLE_PARAMS.borderCellWidth}px solid #000`, minHeight:`${CONFIG_TABLE_PARAMS.minCellHeight}`,
                minWidth:`${CONFIG_TABLE_PARAMS.minCellWidth}`,position:"relative", boxSizing: "content-box"}}
                 onMouseDown={(e)=>{e.stopPropagation();this.DomEditorRef.current.focus()}}

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

export const TableEmbedElement=(props)=>{
    const {block, contentState} = props;
    const {toggleEditorReadOnly}=props.blockProps;
    const {tableID} = contentState.getEntity(block.getEntityAt(0)).getData();
    const {rows, columns}=CREATED_TABLES[tableID];

    const ret = useMemo(()=>{
        let localret=[];
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= columns; j++) {
                localret.push(
                    <TableEmbedCell tableID={tableID} keyID={`${tableID}_${i}_${j}`} key={`${tableID}_${i}_${j}`} />
                )
            }
        }
        return [localret]
    },[rows, columns]);


    return(
        <div id={`TableContainer${tableID}`} style={{width: "min-content", maxWidth:'100%'}}>
            <div  onFocus={()=> {
                document.getElementById(`TableContainer${tableID}`).parentNode.focus();
                toggleEditorReadOnly(true)
            }
            }
                 onBlur={()=>toggleEditorReadOnly(false)}
                 style={{display:"grid", gridTemplateColumns: `repeat(${columns}, fit-content(100%)`, border: `${CONFIG_TABLE_PARAMS.borderCellWidth}px solid #000`, position: "relative"}}>
                {
                   ret
                }
            </div>
        </div>
    )
};