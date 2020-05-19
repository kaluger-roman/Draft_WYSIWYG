import React, {useContext} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import NumericInput from 'react-numeric-input';


import {DraftMainContext} from "../Service&SAGA/Contexts";
import {useDispatch, useSelector} from "react-redux";
import {DraftNeedChangePageFields, DraftSetPageFieldsToStore} from "../../../redux/actions";
import {AlertDialogSlide} from "../AuxiliaryComps/AlertDialog";
import {convertCMtoPX, convertPXtoCM} from "../Service&SAGA/DRAFT_MAIN_SAGA_WATCHER";
import * as St from "../../styles/ConstructorStyles/RichTextEditorStyle.module.css";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
        width: '40vmax'
    },
    divider: {
        alignSelf: 'stretch',
        height: 'auto',
        margin: theme.spacing(1, 0.5),
    },
}));

const StylesForNumericInput={
    wrap: {
        background: '#E2E2E2',
        boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
        padding: '2px 2.26ex 2px 2px',
        borderRadius: '6px 3px 3px 6px',
        fontSize: 32
    },
    input: {
        borderRadius: '4px 2px 2px 4px',
        color: '#988869',
        padding: '0.1ex 1ex',
        border: '1px solid #ccc',
        marginRight: 4,
        display: 'block',
        fontWeight: 100,
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)"
    },
    'input:focus' : {
        border: '1px inset #69C',
        outline: 'none'
    },
    arrowUp: {
        borderBottomColor: 'rgba(66, 54, 0, 0.63)'
    },
    arrowDown: {
        borderTopColor: 'rgba(66, 54, 0, 0.63)'
    }
};

export const  FieldsPropsBlock=React.memo((props)=> {
    const [fieldsValues, setFieldsValues] = React.useState({topField:0, bottomField:0, leftField:0, rightField:0});
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let [isAlertShown, setIsAlertShown] = React.useState(false);


    const dispatch=useDispatch();
    const classes = useStyles();

    const handleAlertOpen = () => {
        setIsAlertShown(true);
    };

    const handleAlertClose = () => {
        setIsAlertShown(false);
    };

    const handleClickOnInput=(e)=>{
        const editorContainerWithPages=document.querySelector(`.${St.ContainerForPagesAndEditor}`)
        const editorScrollTopBefore=editorContainerWithPages.scrollTop;
        e.target.focus();
        e.target.select()
        editorContainerWithPages.scrollTop=editorScrollTopBefore;
    };

    function handlerChangeInput(newVal,strval,inputObj){
        if(!(/^[0-9]{0,2}(\.[0-9])+/).test(strval)/*||newVal<0 || newVal>10*/){
            handleAlertOpen();
            return
        }

        let newState={...fieldsValues,[inputObj.title]:newVal};
        setFieldsValues(newState);
        dispatch(DraftSetPageFieldsToStore(newState))
    }

    return (
        <div>
            <Paper elevation={2} className={classes.paper}>
                <div>
                <div>Верхнее поле</div>
                <NumericInput
                    title='topField'
                    onClick={(e)=>handleClickOnInput(e)}
                    onChange={(val,strval,inputObj)=>handlerChangeInput(val,strval,inputObj)}
                    value={fieldsValues.topField}
                    precision={1}
                    size={6}
                    step={0.1}
                    mobile={false}
                    min={0}
                    max={100}
                    style={StylesForNumericInput}
                  />
                    <div>Нижнее поле</div>
                    <NumericInput
                        title='bottomField'
                        onClick={(e)=>handleClickOnInput(e)}
                        onChange={(val,strval,inputObj)=>handlerChangeInput(val,strval,inputObj)}
                        value={fieldsValues.bottomField}
                        precision={1}
                        size={6}
                        step={0.1}
                        mobile={false}
                        min={0}
                        max={100}
                        style={StylesForNumericInput}
                    />
                    <div>Левое поле</div>
                    <NumericInput
                        title='leftField'
                        onClick={(e)=>handleClickOnInput(e)}
                        onChange={(val,strval,inputObj)=>handlerChangeInput(val,strval,inputObj)}
                        value={fieldsValues.leftField}
                        precision={1}
                        size={6}
                        step={0.1}
                        mobile={false}
                        min={0}
                        max={100}
                        style={StylesForNumericInput}
                    />
                    <div>Правое поле</div>
                    <NumericInput
                        title='rightField'
                        onClick={(e)=>handleClickOnInput(e)}
                        onChange={(val,strval,inputObj)=>handlerChangeInput(val,strval,inputObj)}
                        value={fieldsValues.rightField}
                        precision={1}
                        size={6}
                        step={0.1}
                        mobile={false}
                        min={0}
                        max={100}
                        style={StylesForNumericInput}
                    />

                    <AlertDialogSlide headermessage={'Некорректный ввод'}
                                      message={'введите адекватные данные'}
                                      open ={isAlertShown}
                                      handleClose={()=>saveSelectionStateActionWrapper(()=>handleAlertClose())()}/>
                </div>
            </Paper>
        </div>
    );
})