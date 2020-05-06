import React, {useContext} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';



import {DraftMainContext} from "../Service&SAGA/Contexts";

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

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        margin: theme.spacing(0.5),
        border: 'none',
        padding: theme.spacing(0, 1),
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}))(ToggleButtonGroup);

export const  FieldsPropsBlock=React.memo((props)=> {
    const [formats, setFormats] = React.useState(() => []);
    const [onlyPossibleFormat, setOnlyPossibleFormat] =React.useState(null);
    let {onToggle, currentStyle}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);

    const classes = useStyles();

    return (
        <div>
            <Paper elevation={0} className={classes.paper}>

            </Paper>
        </div>
    );
})