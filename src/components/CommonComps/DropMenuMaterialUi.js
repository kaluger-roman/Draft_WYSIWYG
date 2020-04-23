import React, {forwardRef, useCallback, useContext, useEffect, useMemo} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ThemeProvider } from '@material-ui/core/styles';
import {FONT_FAMILIES_STYLES} from "../styles/ConstructorStyles/DraftStyles/FONT_FAMILIES_STYLES.js";
import './../styles/CommonStyles/commonstyles.css'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import {StandardThemeDropMenu} from "../styles/CommonComponentsStyles/CustomGlobalThemesMUI";
import {ConstructorDropMenuStyle, StandardConstrMenuStyle} from "../styles/CommonComponentsStyles/CustomStylesMUIwithStyles";
import {DraftMainContext} from "./Contexts";

const StyledMenu = withStyles(ConstructorDropMenuStyle)((props) => (
    <ThemeProvider theme={StandardThemeDropMenu}>
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
    </ThemeProvider>
));

const StyledMenuItem = withStyles((theme)=>StandardConstrMenuStyle(theme))(MenuItem);

const CommonListIMenuItems = React.memo((props) => {
    let {onToggle, currentStyle}=props;
    let ret = useMemo(()=>{
        let localret=[];
        console.log('я считаю CommonListIMenuItems');
        for (let type in FONT_FAMILIES_STYLES) {
            let MyListItemText=withStyles({
                primary: {
                    fontFamily: FONT_FAMILIES_STYLES[type].fontFamily
                }
            })(ListItemText);
            localret.push(
                <StyledMenuItem
                                key={type}
                                selected={currentStyle.has(type)}
                    //active={currentStyle.has(FONT_FAMILIES_STYLES[type])}
                                onClick={()=>onToggle(type)}
                                type={FONT_FAMILIES_STYLES.type}>
                    <ListItemIcon>
                        <CreateOutlinedIcon fontSize="large"/>
                    </ListItemIcon>
                    <MyListItemText primary={`${type}`}/>
                </StyledMenuItem>
            )
        }
        return localret;
    },[onToggle]);

    return (
        <React.Fragment>
            {ret}
        </React.Fragment>
    );
});

export default React.memo(function CustomizedMenus(props) {
    let {currentStyle, onToggle}=props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    console.log('я считаю ');
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <Button
                aria-controls="font-families-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={(e)=>{saveSelectionStateActionWrapper(handleClick)(e)}}
                onFocus={(e)=>{e.currentTarget.blur()}}
                tabIndex={-1}
            >
                Open Menu
            </Button>
            <StyledMenu
                id="font-families-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={(e)=>{saveSelectionStateActionWrapper(handleClose)(e)}}
            >
                <CommonListIMenuItems
                    onToggle={onToggle}
                    currentStyle={currentStyle}
                />
            </StyledMenu>
        </div>
    );
})
