import React, {useContext} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import CodeRoundedIcon from '@material-ui/icons/CodeRounded';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatSizeRoundedIcon from '@material-ui/icons/FormatSizeRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';



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

export const  ItalicBoldStylesFont=React.memo((props)=> {
    const [formats, setFormats] = React.useState(() => []);
    const [onlyPossibleFormat, setOnlyPossibleFormat] =React.useState(null);
    let {onToggle, currentStyle}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);

    let allFormatsList=["BOLD","ITALIC","UNDERLINE","CODE"];
    let exclusiveFormatList=['LOWERCASE','UPPERCASE','CAPITALIZE'];

    let currentFontStylesOutside=allFormatsList.filter((val)=>currentStyle.has(val));
    let currentExclusiveFontStylesOutside=exclusiveFormatList.find((val)=>currentStyle.has(val));

    if (JSON.stringify(currentFontStylesOutside)!==JSON.stringify(formats)) {
        setFormats(currentFontStylesOutside);
    }
    if(onlyPossibleFormat!==currentExclusiveFontStylesOutside){
        console.log(currentExclusiveFontStylesOutside);
        setOnlyPossibleFormat(currentExclusiveFontStylesOutside)
    }

    const handleFormat = (event, newFormats) => {
        let formatToToggle=formats.length>newFormats.length?formats.find((val)=>!newFormats.includes(val)):newFormats.find((val)=>!formats.includes(val));
        saveSelectionStateActionWrapper(onToggle)(null,formatToToggle,null)
    };

    const handleOnlyPossibleFormat = (event, newFormat) => {
        saveSelectionStateActionWrapper(onToggle)(null,[onlyPossibleFormat,newFormat],null);
    };

    const classes = useStyles();

    return (
        <div>
            <Paper elevation={0} className={classes.paper}>
                <Divider orientation="vertical" className={classes.divider} />
                <StyledToggleButtonGroup
                    size="small"
                    value={formats}
                    onChange={(event, newFormats)=>handleFormat(event, newFormats)}
                    aria-label="text formatting"
                >
                    <ToggleButton onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="BOLD" aria-label="BOLD">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="ITALIC" aria-label="ITALIC">
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="UNDERLINE" aria-label="UNDERLINE">
                        <FormatUnderlinedIcon />
                    </ToggleButton>
                    <ToggleButton  onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="CODE" aria-label="CODE">
                        <CodeRoundedIcon/>
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider orientation="vertical" className={classes.divider} />
                <StyledToggleButtonGroup
                    size="small"
                    value={onlyPossibleFormat}
                    exclusive
                    onChange={(event, newFormat)=>handleOnlyPossibleFormat(event, newFormat)}
                    aria-label="text formatting exlusive"
                >
                    <ToggleButton  onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="LOWERCASE" aria-label="LOWERCASE">
                        <ArrowDownwardRoundedIcon/>
                    </ToggleButton>
                    <ToggleButton  onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="UPPERCASE" aria-label="UPPERCASE">
                        <ArrowUpwardRoundedIcon/>
                    </ToggleButton>
                    <ToggleButton  onMouseDown={(e)=>e.preventDefault()}   onFocus={(e)=>{e.currentTarget.blur()}} value="CAPITALIZE" aria-label="CAPITALIZE">
                        <FormatSizeRoundedIcon/>
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider orientation="vertical" className={classes.divider} />
            </Paper>
        </div>
    );
})
