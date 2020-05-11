import {Map} from 'immutable';
import {CharacterMetadata} from 'draft-js';

export function ClearInlineStylesOfSuffiksEachCharacter(contentState, selectionState, styleSuffiksToReplace ) {
    var blockMap = contentState.getBlockMap();
    var startKey = selectionState.getStartKey();
    var startOffset = selectionState.getStartOffset();
    var endKey = selectionState.getEndKey();
    var endOffset = selectionState.getEndOffset();
    var newBlocks = blockMap.skipUntil(function (_, k) {
        return k === startKey;
    }).takeUntil(function (_, k) {
        return k === endKey;
    }).concat(Map([[endKey, blockMap.get(endKey)]])).map(function (block, blockKey) {
        var sliceStart;
        var sliceEnd;

        if (startKey === endKey) {
            sliceStart = startOffset;
            sliceEnd = endOffset;
        } else {
            sliceStart = blockKey === startKey ? startOffset : 0;
            sliceEnd = blockKey === endKey ? endOffset : block.getLength();
        }

        var chars = block.getCharacterList();
        var current;
        //////////////
        var stylesOfCharacter;
        var DuplicateStyle;
        let regexp = new RegExp(styleSuffiksToReplace);
        //////////////
        while (sliceStart < sliceEnd) {
            current = chars.get(sliceStart);
//////////////////////////////////////переопределенный кусок
            stylesOfCharacter=current.getStyle();
            DuplicateStyle=Array.from(stylesOfCharacter.values()).find((value => regexp.test(value)));
            if (DuplicateStyle) {
                chars = chars.set(sliceStart, CharacterMetadata.removeStyle(current, DuplicateStyle));
            }
///////////////////////////////
            sliceStart++;
        }

        return block.set('characterList', chars);
    });
    return contentState.merge({
        blockMap: blockMap.merge(newBlocks),
        selectionBefore: selectionState,
        selectionAfter: selectionState
    });
}