export const FindClosestToFocusEditorID=()=>{
  let sel=window.getSelection();
  try {
    let el=sel.anchorNode.parentNode.closest('[inner-draft-editor]');
    return el.getAttribute('inner-draft-editor');
  }
  catch (e) {
    return undefined;
  }
};