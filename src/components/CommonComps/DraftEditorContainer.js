import * as St from "../styles/ConstructorStyles/RichTextEditorStyle.module.css";
import {Editor} from "draft-js";
import {inlineStyleMap} from "../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import React, {useEffect, useMemo, useRef} from "react";
import {connect} from "react-redux";
import {
    DraftAddPageIMITATION, DraftChangeBottomLinePaper,
    DraftChangeMonitorPaperSize,
    DraftChangePaperType, DraftNeedCheckPageImitation, DraftNeedScrollToCurrentCaretPosition,
    DraftRemovePageIMITATION
} from "../../redux/actions";
import {RichTextEditor} from "../ConstructorComponents/RichTextEditor";
import {RichEditoreditor_JSS_STYLE} from "../styles/ConstructorStyles/RichTextEditorStyle___JSS";
import Paper from "@material-ui/core/Paper";
import * as $ from "jquery";

const getBlankPageImitations=(pageImitationsCount/*SpaceBetweenPages*/,monitorPaperSize,DraftChangeBottomLinePaper)=>{
    let ret=[];
    let monitorWidth=document.documentElement.offsetWidth;
    for (let i=0; i<pageImitationsCount;i++){
        ret.push(<Paper elevation={3} style={{
            position: 'absolute',
            height: `${monitorPaperSize.height}vmax`,
            width: `${monitorPaperSize.width}vmax`,
            zIndex: '1',
             left: '0',
             top: `${(monitorPaperSize.height/*+SpaceBetweenPages*/)*i}vmax`,
        }}/>);
        ret.push(<div style={{
            position: 'absolute',
            height: `1px`,
            width: `${monitorPaperSize.width}vmax`,
            zIndex: '2',
            left: '0',
            top: `${(monitorPaperSize.height/*+SpaceBetweenPages*/)*(i+1)}vmax`,
            backgroundColor: '#431409',
        }}/>);
    }
    if(ret.length>0)
  {  DraftChangeBottomLinePaper(parseInt(ret[ret.length-1].props.style.top)*monitorWidth/100);}

    return ret;
};

 const DraftEditorContainer= (props)=> {
    let {
        textAlignment,
        blockStyleFn,
        customStyleMap,
        editorState,
        handleKeyCommand,
        keyBindingFn,
        onChange,
        spellCheck,
        readOnly,
        blockRendererFn,
        pageImitationsCount,
        curPagePaperType,
        monitorPaperSize,
        bottomLinePaper,
        DraftChangeBottomLinePaper,
        DraftChangePaperType,
        DraftChangeMonitorPaperSize,
        DraftNeedScrollToCurrentCaretPosition,
        DraftNeedCheckPageImitation,
        /*SpaceBetweenPages*/
    }=props;



    let DomEditorRef = useRef(null);
     const correctPaperImitationCount=(editorState)=>{
       /*  let monitorWidth=document.documentElement.offsetWidth;
         const bottomEditorTextSpace=$(`.DraftEditor-root`).outerHeight(true);
         if (bottomEditorTextSpace>bottomLinePaper){
             DraftAddPageIMITATION();
         }
         else  if(bottomEditorTextSpace<bottomLinePaper-monitorPaperSize.height*monitorWidth/100){
             DraftRemovePageIMITATION();
         }*/

         DraftNeedCheckPageImitation();
         DraftNeedScrollToCurrentCaretPosition();


         onChange(editorState);
     } ;

    const retOfBlankImitationPages=useMemo(()=>{
        return getBlankPageImitations(pageImitationsCount/*,SpaceBetweenPages*/,monitorPaperSize,DraftChangeBottomLinePaper)
    },[pageImitationsCount/*,SpaceBetweenPages*/,monitorPaperSize,DraftChangeBottomLinePaper]);

    return(
    <div className={St.ContainerForPagesAndEditor}  onClick={()=>DomEditorRef.current.focus()}>
        <div id='RichEditoreditor_' style={RichEditoreditor_JSS_STYLE}
          >
            {retOfBlankImitationPages}
            <Editor
                textAlignment={textAlignment}
                blockStyleFn={blockStyleFn}
                customStyleMap={customStyleMap}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
                onChange={(editorState)=>correctPaperImitationCount(editorState)}
                spellCheck={spellCheck}
                readOnly={readOnly}
                blockRendererFn={blockRendererFn}
                ref={DomEditorRef}
                /*blockRenderMap={
                    DefaultDraftBlockRenderMap.merge(
                        Immutable.Map({
                            'exampleblocktype': { //atomic чтобы onbackspace удалял все сразу , надо иметь такой тип атомик всегда и на основе допустим энтити внутри рисовать все
                                element: 'H1',  //ВМЕСТО БЛОКА  С ТИПО ЭКЗАМПЛ ТАЙП КАКИМ БЫ ОН НЕ БЫЛ ТЭГОМ ХТМЛ РИСУЕТ ЭЛЕМЕНТ, СОХРАНЯЯ ВНУТРЕННОСТИ, ПОВЕРХ МОЖНО СВОЙ РАКТ ЭЛЕМЕНТ ВОКРУГ ЕЩЕ
                                wrapper: <Examplewrappercomp/>
                            },
                        })
                    )}*/
            />
        </div>
    </div>
    )
}
export default connect(
    (state)=>{
        return{
            pageImitationsCount:state.Draft.pageImitationsCount,
            curPagePaperType:state.Draft.curPagePaperType,
            monitorPaperSize:state.Draft.monitorPaperSize,
            bottomLinePaper:state.Draft.bottomLinePaper,
           /* SpaceBetweenPages:state.Draft.SpaceBetweenPages,*/
        }
    },
    {
        DraftChangePaperType:DraftChangePaperType,
        DraftChangeMonitorPaperSize:DraftChangeMonitorPaperSize,
        DraftChangeBottomLinePaper:DraftChangeBottomLinePaper,
        DraftNeedScrollToCurrentCaretPosition:DraftNeedScrollToCurrentCaretPosition,
        DraftNeedCheckPageImitation:DraftNeedCheckPageImitation
    })(DraftEditorContainer);