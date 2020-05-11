import * as St from "../styles/ConstructorStyles/RichTextEditorStyle.module.css";
import {Editor} from "draft-js";
import React, {useEffect, useMemo, useRef} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {
    DraftAddPageIMITATION, DraftChangeBottomLinePaper,
    DraftChangeMonitorPaperSize,
    DraftChangePaperType, DraftNeedCheckPageImitation, DraftNeedScrollToCurrentCaretPosition,
    DraftRemovePageIMITATION
} from "../../redux/actions";
import {RichEditoreditor_JSS_STYLE} from "../styles/ConstructorStyles/RichTextEditorStyle___JSS";
import Paper from "@material-ui/core/Paper";

function PaperForImitation(props) {
    let { withBottomDivider, i,id, monitorPaperSize, pageFields,pageImitationsCount}=props;
    const divider = <div style={{
        position: 'absolute',
        height: `3px`,
        width: `${monitorPaperSize.width}vw`,
        zIndex: '2',
        left: '0',
        top: `${(monitorPaperSize.height*(i+1)+  pageFields.topField )}vw`,
        backgroundColor: '#431409',
    }}/> ;


    return (
        <React.Fragment>
        <div  id={id}
             style={{
                 zIndex: '1',
                 position: 'absolute',
                 left: '0',
                 top: `${monitorPaperSize.height*i +  (i !== 0 ? pageFields.topField : 0)}vw`,
             }}>
            <Paper elevation={24} style={{
                position: 'relative',
                zIndex:'0',
                height: `${monitorPaperSize.height + (i === 0 ? pageFields.topField : 0)+(i === pageImitationsCount-1 ? pageFields.bottomField : 0)}vw`,
                width: `${monitorPaperSize.width}vw`,
            }}/>
        </div>
         {withBottomDivider?divider:undefined}
        </React.Fragment>
    )
}

const getBlankPageImitations=(pageImitationsCount,monitorPaperSize,dispatch,DraftChangeBottomLinePaper,pageFields)=>{
    let ret=[];
    let BottomLinePaper=0;
    for (let i=0; i<pageImitationsCount;i++){

        ret.push(<PaperForImitation key={`Paper${i}`} id={`Paper${i}`} withBottomDivider={i!==(pageImitationsCount-1)} i={i} monitorPaperSize={monitorPaperSize} pageFields={pageFields} pageImitationsCount={pageImitationsCount}/>)
        BottomLinePaper+=monitorPaperSize.height + (i === 0 ? pageFields.topField : 0)+(i === pageImitationsCount-1 ? pageFields.bottomField : 0);
        /*ret.push(<Paper key={`Paper${i}`} elevation={24} style={{
            position: 'absolute',
            height: `${monitorPaperSize.height}vw`,
            width: `${monitorPaperSize.width}vw`,
            zIndex: '1',
             left: '0',
             top: `${(monitorPaperSize.height/!*+SpaceBetweenPages*!/)*i}vw`,
        }}/>);
        ret.push(<div key={`PaperDivider${i}`} style={{
            position: 'absolute',
            height: `1px`,
            width: `${monitorPaperSize.width}vw`,
            zIndex: '2',
            left: '0',
            top: `${(monitorPaperSize.height/!*+SpaceBetweenPages*!/)*(i+1)}vw`,
            backgroundColor: '#431409',
        }}/>);*/
    }
    if(ret.length>0)
  {
      dispatch(DraftChangeBottomLinePaper(BottomLinePaper/*parseFloat(document.getElementById(ret[ret.length-1].props.id).style.bottom)*/));
  }

    return ret;
};

 export default /*const DraftEditorContainer=*/ React.memo( (props)=> {
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
        /*SpaceBetweenPages*/
    }=props;

    let {pageImitationsCount, curPagePaperType, monitorPaperSize, pageFields}=useSelector((state)=>state.Draft);
    let dispatch=useDispatch();

    let DomEditorRef = useRef(null);
     const correctPaperImitationCount=(editorState)=>{
         onChange(editorState);

         setTimeout(()=>{
             dispatch (DraftNeedCheckPageImitation());
             dispatch ( DraftNeedScrollToCurrentCaretPosition());
         },0)

     } ;

    const retOfBlankImitationPages=useMemo(()=>{
        return getBlankPageImitations(pageImitationsCount/*,SpaceBetweenPages*/,monitorPaperSize,dispatch,DraftChangeBottomLinePaper, pageFields)
    },[pageImitationsCount/*,SpaceBetweenPages*/,monitorPaperSize,DraftChangeBottomLinePaper,pageFields]);

    return(
    <div className={St.ContainerForPagesAndEditor}  onClick={()=>DomEditorRef.current.focus()}>
        <div id='RichEditoreditor_' style={RichEditoreditor_JSS_STYLE}>
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
})

