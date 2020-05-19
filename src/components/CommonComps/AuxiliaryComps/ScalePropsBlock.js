import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import {useDispatch} from "react-redux";
import {DraftChangeScale} from "../../../redux/actions";


const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
});

export  const ScalePropsBlock=() =>{
    const classes = useStyles();
    const [curScale, setCurScale] = React.useState(100);//в%
    const dispatch=useDispatch();


    const handleSliderChange = (event, newScale) => {
        setCurScale(newScale);
        dispatch(DraftChangeScale(newScale))
    };

    const handleInputChange = (event) => {
        setCurScale(event.target.value === '' ? 100 : Number(event.target.value));
        dispatch(DraftChangeScale(event.target.value === '' ? 100 : Number(event.target.value)))
    };

    const handleBlur = () => {
        if (curScale < 30) {
            setCurScale(30);
        } else if (curScale > 300) {
            setCurScale(300);
        }
    };

    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom>
                Scale
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <ZoomInIcon />
                </Grid>
                <Grid item xs>
                    <Slider
                        max={300}
                        min={30}
                        track={'normal'}
                        value={typeof curScale === 'number' ? curScale : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        className={classes.input}
                        value={curScale}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 30,
                            max: 300,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
