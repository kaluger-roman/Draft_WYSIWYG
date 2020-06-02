import * as St from "../styles/ConstructorStyles/RichTextEditorStyle.module.css";
import {Editor, EditorState} from "draft-js";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import { useDispatch, useSelector} from "react-redux";
import {
     DraftNeedCheckPageImitation, DraftNeedScrollToCurrentCaretPosition,
} from "../../redux/actions";
import  "../styles/ConstructorStyles/GlobalDraftStyles.css";
import Paper from "@material-ui/core/Paper";
import * as $ from "jquery";
const { domEvent } = require('dom-event-simulate');

function focusEditorCallback(e,readOnly,editorState, onChange, DomEditorRef) {
    {
        if(readOnly){
            setTimeout(()=>{console.log('фокусю '+ performance.now()); DomEditorRef.current.focus()},200);// пересмотреть
            return;
        }

        let x=e.clientX;
        let y=e.clientY;

        let EditorRoot=$(`.DraftEditor-root`).get(0);
        let EditorRootRectPoor=EditorRoot.getBoundingClientRect();
        let stylesEditor=getComputedStyle(EditorRoot);
        let EditorRootRect={
            right:EditorRootRectPoor.right-(parseFloat(stylesEditor.paddingRight)+parseFloat(stylesEditor.marginRight)),
            left:EditorRootRectPoor.left+(parseFloat(stylesEditor.paddingLeft)+parseFloat(stylesEditor.marginLeft)),
            top:EditorRootRectPoor.top+(parseFloat(stylesEditor.paddingTop)+parseFloat(stylesEditor.marginTop)),
            bottom:EditorRootRectPoor.bottom-(parseFloat(stylesEditor.paddingBottom)+parseFloat(stylesEditor.marginBottom)),
            width:EditorRootRectPoor.width-(parseFloat(stylesEditor.paddingRight)+parseFloat(stylesEditor.marginRight)+parseFloat(stylesEditor.paddingLeft)+parseFloat(stylesEditor.marginLeft)),
            height:EditorRootRectPoor.height-(parseFloat(stylesEditor.paddingTop)+parseFloat(stylesEditor.marginTop)+parseFloat(stylesEditor.paddingBottom)+parseFloat(stylesEditor.marginBottom)),
        };


        let exactElement=document.elementFromPoint(x, y);

        if(exactElement.closest('div').getAttributeNames().includes('data-offset-key'))
            return;

        let key;
        let zoneName;
        let divEl;

        if(y<EditorRootRect.top){
            let firstBlock=editorState.getCurrentContent().getFirstBlock();
            key=firstBlock.getKey();
            zoneName='top';
            divEl=EditorRoot.querySelector(`[data-offset-key^="${key}"]`)
        }
        else
        if(y>EditorRootRect.bottom){
            let lastBlock=editorState.getCurrentContent().getLastBlock();
            key=lastBlock.getKey();
            zoneName='bottom';
            divEl=EditorRoot.querySelector(`[data-offset-key^="${key}"]`)
        }
        else{
            zoneName='side';
            let element;
            let curSearchX=EditorRootRect.left;
            while (!element || !(element.closest('div').getAttributeNames().includes('data-offset-key'))){
                element = document.elementFromPoint(curSearchX, y);
                curSearchX+=50;
                if (curSearchX>EditorRootRect.right)
                    break;
            }

            divEl=element.closest('div');
            try {
                key = divEl.getAttribute('data-offset-key').match(/^[^-]*/)[0];
            }
            catch (e) {
                key=undefined;
            }
        }
        if (key) {
            let testRange= document.createRange();
            let BlockKey=editorState.getCurrentContent().getBlockForKey(key);

            if(BlockKey.getType()==="atomic")
                return;

            function findMinValInElementThreeWrapper(element){
                let minVal=window.innerWidth;
                let elWithMinVal;
                let minInx;

                //let distFunc=zoneName==='side'?(searchRect)=>Math.abs(x-searchRect.left):(searchRect)=>Math.sqrt((x-searchRect.left)**2+(y-searchRect.bottom)**2);

                let sumOfLetters=0;
                let bufferSum=0;
                function findMinValInElementThree(element){//element -div
                    if (element.nodeName!=='#text'){
                        element.childNodes.forEach((child)=>findMinValInElementThree(child));
                    }
                    else {
                        let length=element.textContent.length;
                        for (let i=0;i<length;i++){
                            bufferSum+=1;
                            testRange.setStart(element,i);
                            testRange.setEnd(element,i);
                            let searchRect=testRange.getBoundingClientRect();
                            let curDist=Math.sqrt((x-searchRect.left)**2+(y-searchRect.bottom)**2);//Math.abs(x-searchRect.left);
                            if(minVal>curDist) {
                                minVal = curDist;
                                elWithMinVal=element;
                                minInx=i;
                                sumOfLetters+=bufferSum;
                                bufferSum=0;
                            }
                        }
                        if(sumOfLetters===BlockKey.getLength())
                            minInx+=1;
                    }
                }
                findMinValInElementThree(element);
                return {elWithMinVal,minInx}
            }

            let {elWithMinVal,minInx}=findMinValInElementThreeWrapper(divEl);

            onChange(EditorState.forceSelection(editorState, editorState.getSelection().merge({
                hasFocus: false,
            })));
            setTimeout(()=>{
                try {
                    let sel = window.getSelection();
                    testRange.setStart(elWithMinVal, minInx);
                    testRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(testRange);
                }
                catch (e) {
                    console.log(e.message)
                    console.log(e.stackTrace)
                    console.log('проверь выделение при клике вне редактора')
                }

            },0)

        }

    }
}


function PaperForImitation(props) {
    let {withBottomDivider, i, id, pageFields, pageImitationsCount,curPagePaperType,orientation} = props;

    const divider = <div style={{
        position: 'absolute',
        height: `3px`,
        width: `${curPagePaperType[orientation].width}mm`,
        zIndex: '2',
        left:'0',
        right:'0',
        marginLeft:'auto',
        marginRight:'auto',
        top: `${(i+1)*(curPagePaperType[orientation].height-pageFields.topField-pageFields.bottomField) +pageFields.topField}mm`,
        backgroundColor: '#431409',
    }}/>;

    return (
        <React.Fragment>
            <div id={id}
                 style={{
                     zIndex: '1',
                     position: 'absolute',
                     left:'0',
                     right:'0',
                     marginLeft:'auto',
                     marginRight:'auto',
                     width: `${curPagePaperType[orientation].width}mm`,
                     top: `${(i)*(curPagePaperType[orientation].height-pageFields.topField-pageFields.bottomField) +(i !== 0 ? pageFields.topField : 0)}mm`,
                 }}>
                <Paper elevation={24} style={{
                    position: 'relative',
                    zIndex: '0',
                    height: `${curPagePaperType[orientation].height - (i !== 0 ? pageFields.topField : 0) - (i !== pageImitationsCount - 1 ? pageFields.bottomField : 0)}mm`,
                    width: `${curPagePaperType[orientation].width}mm`,
                }}/>
            </div>
            {withBottomDivider ? divider : undefined}
        </React.Fragment>
    )
}

const getBlankPageImitations = (pageImitationsCount, dispatch, pageFields, curPagePaperType,orientation) => {
    let ret = [];
    for (let i = 0; i < pageImitationsCount; i++) {
        ret.push(<PaperForImitation key={`Paper${i}`} id={`Paper${i}`}
                                    withBottomDivider={i !== (pageImitationsCount - 1)} i={i}
                                    pageFields={pageFields}
                                    pageImitationsCount={pageImitationsCount}
                                    curPagePaperType={curPagePaperType}
                                    orientation={orientation}
        />)
    }
    return ret;
};

export default /*React.memo(*/(props) => {
    let {textAlignment, blockStyleFn, customStyleMap, editorState, handleKeyCommand,
        keyBindingFn, onChange, spellCheck, readOnly, blockRendererFn,} = props;

    let {pageImitationsCount, pageFields, curPagePaperType,orientation} = useSelector((state) => state.Draft);
    let dispatch = useDispatch();

    let DomEditorRef = useRef(null);


    const correctPaperImitationCount = (editorState) => {
        onChange(editorState);

        setTimeout(() => {
            dispatch(DraftNeedCheckPageImitation());
            dispatch(DraftNeedScrollToCurrentCaretPosition());
        }, 0)

    };

    const retOfBlankImitationPages = useMemo(() => {
        return getBlankPageImitations(pageImitationsCount, dispatch, pageFields,curPagePaperType,orientation)
    }, [pageImitationsCount, pageFields, curPagePaperType,orientation]);

    const focusCallback=useCallback((e)=>{focusEditorCallback(e,readOnly,editorState, onChange,DomEditorRef)},[readOnly, editorState]);

    return (
        <div className={St.ContainerForPagesAndEditor}  onMouseDown={(e) =>focusCallback(e) }
        >
            <div id='RichEditoreditor_'
                 >
                {retOfBlankImitationPages}
                <Editor
                    textAlignment={textAlignment}
                    blockStyleFn={blockStyleFn}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={keyBindingFn}
                    onChange={(editorState) => correctPaperImitationCount(editorState)}
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
}/*)*/

