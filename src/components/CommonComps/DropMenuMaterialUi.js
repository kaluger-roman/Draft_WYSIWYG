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
import {inlineStyleMap} from "../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import {REGEXP_FONT_FAMILY_SUFFIKS} from "../styles/ConstructorStyles/DraftStyles/RegexpForStyleSuffiks";

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
    let {onToggle, currentStyle, shouldMenuSelectedItemUpdate}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let [oldSelectedItem, setOldSelectedItem] = React.useState({Elem:null, indexinret:null});
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
                    disabled={currentStyle.has(type)}
                    onMouseDown={(e)=>{
                        if (!e.target.disabled)
                            console.log(type);
                        saveSelectionStateActionWrapper(onToggle)(null, type, REGEXP_FONT_FAMILY_SUFFIKS);

                    }}
                    type={FONT_FAMILIES_STYLES.type}>
                    <ListItemIcon>
                        <CreateOutlinedIcon fontSize="large"/>
                    </ListItemIcon>
                    <MyListItemText primary={`${type}`}/>
                </StyledMenuItem>
            )
        }
        return localret;
    },[]);

    if (shouldMenuSelectedItemUpdate) {
    // console.log(oldSelectedItem);
        let findNewSelectIndex = ret.findIndex((value) => currentStyle.has(value.key));
        //console.log(findNewSelectIndex);
        if (findNewSelectIndex!==oldSelectedItem.indexinret) {//ЕСЛИ ЗАДИЗЭБЛИТЬ КНОПКИ МОЖНО НЕ ПРОВЕРЯТЬ ТАКИЕ УСЛОВИЯ И ПЕРЕДЕЛАТЬ
            if (oldSelectedItem.Elem) {
                let MyListItemText = withStyles({
                    primary: {
                        fontFamily: FONT_FAMILIES_STYLES[oldSelectedItem.Elem.key].fontFamily
                    }
                })(ListItemText);
                let oldProps = oldSelectedItem.Elem.props;
                ret[oldSelectedItem.indexinret] =
                    <StyledMenuItem  {...oldProps} selected={false} disabled={false} key={oldSelectedItem.Elem.key}>
                        <ListItemIcon>
                            <CreateOutlinedIcon fontSize="large"/>
                        </ListItemIcon>
                        <MyListItemText primary={`${oldSelectedItem.Elem.key}`}/>
                    </StyledMenuItem>
            }
            if(ret[findNewSelectIndex] && findNewSelectIndex>-1){
                setOldSelectedItem({Elem: ret[findNewSelectIndex], indexinret: findNewSelectIndex});}
        }
            if (findNewSelectIndex>-1 && findNewSelectIndex !== -1) {
                let newkey = ret[findNewSelectIndex].key;
                let MyListItemText = withStyles({
                    primary: {
                        fontFamily: FONT_FAMILIES_STYLES[newkey].fontFamily
                    }
                })(ListItemText);
                let newProps = ret[findNewSelectIndex].props;
                ret[findNewSelectIndex] =
                    <StyledMenuItem   {...newProps} selected={true} disabled={true} key={newkey}>
                        <ListItemIcon>
                            <CreateOutlinedIcon fontSize="large"/>
                        </ListItemIcon>
                        <MyListItemText primary={ret[findNewSelectIndex].key}/>
                    </StyledMenuItem>

            }
    }


    return (
        <React.Fragment>
            {ret}
        </React.Fragment>
    );
});

export default React.memo(function CustomizedMenus(props) {
    let {currentStyle, onToggle}=props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [shouldMenuSelectedItemUpdate, setShouldMenuSelectedItemUpdate] = React.useState(false);

    //console.log('перерисовка menu'+currentStyle);

    //console.log(' '+currentStyle);
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setShouldMenuSelectedItemUpdate(true);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setShouldMenuSelectedItemUpdate(false);
    };
    return (
        <div>
            <Button
                aria-controls="font-families-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onMouseDown={(e)=>{e.preventDefault();saveSelectionStateActionWrapper(handleClick)(e)}}
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
                mouseEvent={(e)=>{e.preventDefault(); e.stopPropagation()}}
                onClickAway={(e)=>{e.preventDefault();  e.stopPropagation()}}
            >
                <CommonListIMenuItems
                    onToggle={onToggle}
                    currentStyle={currentStyle}
                    shouldMenuSelectedItemUpdate={shouldMenuSelectedItemUpdate}
                />
            </StyledMenu>
        </div>
    );
})
