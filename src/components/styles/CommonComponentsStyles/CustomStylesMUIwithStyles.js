export const ConstructorDropMenuStyle = {
    paper: {
        border: '1px solid #d3d4d5',
        width: "20vmax",
        height: "40vmin"
    },
    list: {
        autoFocusItem: false,
        width: "20vmax",
        height: "40vmin"
    },
};

export const StandardConstrMenuStyle=(theme) => ({
    root: {
       /* '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },*/
            /*backgroundColor: "blue",*/
            "&$selected": {
                backgroundColor: "red"
            },
    },
    selected: {}

});

