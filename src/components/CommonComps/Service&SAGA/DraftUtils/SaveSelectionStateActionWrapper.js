import {EditorState} from "draft-js";

/*
export const SaveSelectionStateActionWrapperFactory=(state, onChange)=>(wrapFunc)=> {
    return async (e,...params) => {
        if (e) {
            e.preventDefault();
        }
        let {editorState} = state;
        const selectionbefore = editorState.getSelection();
        let selectionStartBlockKey=selectionbefore.getStartKey();
        let contentState=editorState.getCurrentContent();
        let selBlockType=contentState.getBlockForKey(selectionStartBlockKey).getType();
        if (selBlockType==='atomic'){
            return ;
        }
        if(wrapFunc && !e && !params.length>0){
            await wrapFunc();
        }

        if(wrapFunc && e){
            await wrapFunc(e);
        }
        if(wrapFunc && params.length>0){
            await wrapFunc(...params, editorState);
        }
        const curinlinestyles=editorState.getCurrentInlineStyle();
        onChange((EditorState.setInlineStyleOverride(EditorState.forceSelection(editorState, selectionbefore), curinlinestyles)))
    }
};*/
export const SaveSelectionStateActionWrapperFactory=()=>(wrapFunc)=> {
    return async (e,...params) => {
        if (e) {
            e.preventDefault();
        }
        let sel,rng;
        try {
             sel=window.getSelection();
             rng=sel.getRangeAt(0);
        }
       catch (e) {

       }
        if(wrapFunc && !e && !params.length>0){
            await wrapFunc();
        }

        if(wrapFunc && e){
            await wrapFunc(e);
        }
        if(wrapFunc && params.length>0){
            await wrapFunc(...params);
        }
        if(rng) {
            sel.removeAllRanges();
            sel.addRange(rng);
        }
    }
};