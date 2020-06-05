import {RichUtils} from "draft-js";

export const ToggleBlockTypeFactory=(state, onChange)=>(blockType)=>{
    onChange(
        RichUtils.toggleBlockType(
            state.editorState,
            blockType
        )
    );
};
