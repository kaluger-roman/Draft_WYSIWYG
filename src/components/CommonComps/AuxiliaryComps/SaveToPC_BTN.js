import React, {useContext} from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import {DraftMainContext} from "../Service&SAGA/Contexts";
import {convertToRaw} from 'draft-js'

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));
export const SaveToPcButton=React.memo((props)=> {
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let editorState=props.editorState;

    const classes = useStyles();
    const handleSaveToPc=(e)=>{
        //e.preventDefault();
        e.target.blur();
        let rawDraftContentState=convertToRaw(editorState.getCurrentContent());
        let JSONrawDraftContentState=JSON.stringify(rawDraftContentState);
        download('proba.txt', JSONrawDraftContentState);

    };

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                onMouseDown={(e)=>saveSelectionStateActionWrapper(handleSaveToPc)(e)}
            >
                Save
            </Button>
        </React.Fragment>
    )
});