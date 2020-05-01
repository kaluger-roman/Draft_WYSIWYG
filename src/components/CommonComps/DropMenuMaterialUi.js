import React, {forwardRef, useCallback, useContext, useEffect, useMemo} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { ThemeProvider } from '@material-ui/core/styles';
import './../styles/CommonStyles/commonstyles.css'
import {StandardThemeDropMenu} from "../styles/CommonComponentsStyles/CustomGlobalThemesMUI";
import {ConstructorDropMenuStyle, StandardConstrMenuStyle} from "../styles/CommonComponentsStyles/CustomStylesMUIwithStyles";
import {DraftMainContext} from "./Contexts";
import {FontsListMenuItems} from "./MenuItemsListsCollection/FontsListMenuItems";
import {ColorPickerListMenuItems} from "./MenuItemsListsCollection/ColorPickerListMenuItems";
import {FontSizesListMenuItems} from "./MenuItemsListsCollection/FontSizesListMenuItems";

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



export default React.memo(function CustomizedMenus(props) {
    let {currentStyle, onToggle, menuType}=props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [shouldMenuSelectedItemUpdate, setShouldMenuSelectedItemUpdate] = React.useState(false);
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setShouldMenuSelectedItemUpdate(true);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setShouldMenuSelectedItemUpdate(false);
    };
    let ListMenu;
    switch (menuType) {
        case 'FONT_FAMILY_PICKER': ListMenu=FontsListMenuItems; break;
        case 'COLOR_PICKER': ListMenu=ColorPickerListMenuItems; break;
        case 'FONT_SIZE_PICKER': ListMenu=FontSizesListMenuItems; break;
        case 'COLOR_BG_FILL_PICKER': ListMenu=undefined; break;
    }
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
                {menuType}
            </Button>
            <StyledMenu
                id="font-families-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={(e)=>{saveSelectionStateActionWrapper(handleClose)(e)}}
            >
                {

                }
                <ListMenu
                    onToggle={onToggle}
                    currentStyle={currentStyle}
                    shouldMenuSelectedItemUpdate={shouldMenuSelectedItemUpdate}
                />
            </StyledMenu>
        </div>
    );
})
