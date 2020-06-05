import {ClearInlineStylesOfSuffiksEachCharacter} from "./ClearInlineStylesOfSuffiksEachCharacter";
import {EditorState, RichUtils} from "draft-js";

export function _toggleInlineStyle(inlineStyle, styleSuffiksToReplace, statebefore) { //styleSuffiksToReplace -суффикс стиля, если есть то должен заменить стиль с тем же суффиксом, например, для шрифтов, заменить старый, а не тыкнуть поверх

    if (styleSuffiksToReplace) {//inlineStyle может быть массивом стилей, которые надо затоглить
        const curContentState = statebefore.getCurrentContent();
        const curSelectionState = statebefore.getSelection();
        if (!curSelectionState.isCollapsed()) {
            const newContentState = ClearInlineStylesOfSuffiksEachCharacter(curContentState, curSelectionState, styleSuffiksToReplace);
            statebefore = EditorState.push(statebefore, newContentState, 'change-inline-style');
        }
        else{
            let DuplicateStyle=statebefore.getCurrentInlineStyle().toArray().find((value => (new RegExp(styleSuffiksToReplace)).test(value)));
            if (DuplicateStyle) {
                statebefore = RichUtils.toggleInlineStyle(statebefore, DuplicateStyle);
            }
        }
    }
    if (Array.isArray(inlineStyle)) {
        inlineStyle.forEach((val) => {
            statebefore = RichUtils.toggleInlineStyle(statebefore, val)
        })
    } else {
        statebefore = RichUtils.toggleInlineStyle(statebefore, inlineStyle);
    }
    return statebefore;
}
