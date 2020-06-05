import {TABLE_ENTITY_TYPE} from "../../../styles/ConstructorStyles/DraftStyles/NAMING_CONSTANTS";
import {TableEmbedElement} from "../../EmbedElements/Tables/TableEmbedElementV1";

export const  BlockRendererFnFactory=(state,toggleEditorReadOnly)=>(contentBlock)=> {
    const entityKey=contentBlock.getEntityAt(0);
    if (!entityKey)
        return;
    const entity=state.editorState.getCurrentContent().getEntity(entityKey);
    let entityType=entity.getType();
    const type = contentBlock.getType();
    if (entityType===TABLE_ENTITY_TYPE) {
        return {
            component: TableEmbedElement,          //внутрь вставляется этот элемент, заменяя все внутри, сам элемент внешний принимает параметр эдитэбл
            editable: false,//вызывает вопросы, но иначе ошибка из-за отсутствия выделения, возможно не роляет за счет readonly
            props: {
                toggleEditorReadOnly:toggleEditorReadOnly,
                editorState: state.editorState,
            },
        };
    }
}