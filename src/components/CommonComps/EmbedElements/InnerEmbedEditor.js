import React, {useCallback, useEffect, useRef, useState} from "react";
import {CompositeDecorator, Editor, EditorState, RichUtils} from "draft-js";
import {_toggleInlineStyle} from "../Service&SAGA/DraftUtils/ToggleInlineStyle";
import {MapKeyToEditorCommandFactory} from "../Service&SAGA/DraftUtils/MapKeyToEditorCommand";
/*
import { BlockRendererFnFactory} from "../Service&SAGA/DraftUtils/BlockRendererFunction";
*/
import {DraftMainContext} from "../Service&SAGA/Contexts";
import {inlineStyleMap} from "../../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import {useDispatch, useSelector} from "react-redux";
import {SaveSelectionStateActionWrapperFactory} from "../Service&SAGA/DraftUtils/SaveSelectionStateActionWrapper";
import {HandleKeyCommandFactory} from "../Service&SAGA/DraftUtils/HandleKeyCommand";
import {DraftInlineStyleToggle, DraftNeedMergeTableCells} from "../../../redux/actions";


export const InnerEmbedEditor =(props)=> {
    const {editorState, onChange, outerReasonReadOnly, id}=props;
    const [localReadOnly, setLocalReadOnly]=useState(false);
    const  _saveSelectionStateActionWrapper=useCallback((wrapFunc)=>SaveSelectionStateActionWrapperFactory(editorState,onChange)(wrapFunc),[editorState,onChange]);
    const {InlineToggleStyle_Suffiks_IdEditor_Obj}=useSelector(state=>state.Draft);
    const toggleEditorReadOnly=useCallback((readonly) =>setLocalReadOnly( readonly),[]);
    const DomEditorRef=useRef(null);
    let dispatch=useDispatch();

    useEffect(()=>{
        if (InlineToggleStyle_Suffiks_IdEditor_Obj && InlineToggleStyle_Suffiks_IdEditor_Obj.id===id) {
            let {styleName, regexp, id}=InlineToggleStyle_Suffiks_IdEditor_Obj;
            onChange(_toggleInlineStyle(styleName,regexp,editorState), id);
            dispatch(DraftInlineStyleToggle(undefined));
        }
    }, [InlineToggleStyle_Suffiks_IdEditor_Obj]);

        return (
            <DraftMainContext.Provider value={_saveSelectionStateActionWrapper}>
                <div inner-draft-editor={id} onClick={()=>DomEditorRef.current.focus()}>
                <Editor
                    textAlignment='left'
                    editorState={editorState}
                    handleKeyCommand={(command, editorState)=>HandleKeyCommandFactory(onChange)(command, editorState)}
                    customStyleMap={inlineStyleMap}
                    onChange={(editorState)=>onChange(editorState, id)}
                    ref={DomEditorRef}
                    readOnly={outerReasonReadOnly||localReadOnly}
                    blockRendererFn={(contentBlock)=>{/*BlockRendererFnFactory(editorState, toggleEditorReadOnly)(contentBlock)*/}}
                    keyBindingFn={(e)=>MapKeyToEditorCommandFactory(editorState,onChange)(e)}
                />
                </div>
            </DraftMainContext.Provider>
        );
    }