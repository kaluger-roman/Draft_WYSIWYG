import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const StandardThemeDropMenu=createMuiTheme({
    props: {
        MuiModal: {
            disableEnforceFocus : true,
        },
        MuiTrapFocus: {
            disableEnforceFocus : true,
        },
        MuiMenu: {
            disableScrollLock: true,
        },
        MuiPopover:{
            onMouseDown:(e)=>e.preventDefault(),
        }
    },
});