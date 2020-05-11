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
            onMouseDown:(e)=>e.preventDefault(),//когда открыто меню не снимает выделение текста при событии
        }
    },
});
export const NonBlockSelectionThemeDropMenu=createMuiTheme({
    props: {
        /*MuiModal: {
            disableEnforceFocus : true,
        },
        MuiTrapFocus: {
            disableEnforceFocus : true,
        },
        MuiMenu: {
            disableScrollLock: true,
        },*/
        MuiPopover:{
            onMouseDown:undefined,//наоборот с StandardThemeDropMenu чтобы дать возможность выделчть внутри меню
        }
    },
});

