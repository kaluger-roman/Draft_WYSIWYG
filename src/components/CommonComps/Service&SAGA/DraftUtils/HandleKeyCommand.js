import {RichUtils} from "draft-js";

export const HandleKeyCommandFactory=(onChange)=>(command, editorState)=> {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
        onChange(newState);
        return 'handled';//или тру фолс?
    }
    return 'not-handled';
}