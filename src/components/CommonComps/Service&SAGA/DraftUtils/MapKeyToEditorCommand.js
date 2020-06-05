import {getDefaultKeyBinding, RichUtils} from "draft-js";

export const MapKeyToEditorCommandFactory=(state, onChange)=>(e)=> {
    if (e.keyCode === 9 /* TAB */) {
        const newEditorState = RichUtils.onTab(e, state.editorState, 4);
        if (newEditorState !== state.editorState) {
            onChange(newEditorState);
        }
        return;
    }
    if (e.keyCode === 8 /* backspace */) {
        const newEditorState = RichUtils.onBackspace(state.editorState,);
        if (newEditorState && newEditorState !== state.editorState) {
            onChange(newEditorState);
        }
    }
    return getDefaultKeyBinding(e);
}