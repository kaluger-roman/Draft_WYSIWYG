import React, {useContext, useMemo} from "react";
import {DraftMainContext} from "../Service&SAGA/Contexts";
import {FONT_FAMILIES_STYLES} from "../../styles/ConstructorStyles/DraftStyles/FONT_FAMILIES_STYLES";
import {withStyles} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {REGEXP_FONT_FAMILY_SUFFIKS} from "../../styles/ConstructorStyles/DraftStyles/RegexpForStyleSuffiks";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {FontsMenuItem} from "../MenuItemsCollection/FontsMenuItem";
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import {DraftInlineStyleToggle} from "../../../redux/actions";
import {FindClosestToFocusEditorID} from "../Service&SAGA/DraftUtils/FindClosestToFocusEditor";
import {useDispatch} from "react-redux";

export const FontsListMenuItems = React.memo((props) => {//можно сделать алгоритм как в списке размеров шрифтов, тогда легче код, но при таком количестве шрифтов в данном компеоненте юзмемо будет слишком много жрать производительности
    let {onToggle, currentStyle, shouldMenuSelectedItemUpdate}=props;
    let { saveSelectionStateActionWrapper}=useContext(DraftMainContext);
    let [oldSelectedItem, setOldSelectedItem] = React.useState({Elem:null, indexinret:null});
    let dispatch=useDispatch();
    let ret = useMemo(()=>{
        let localret=[];
        for (let type in FONT_FAMILIES_STYLES) {
            let MyListItemText=withStyles({
                primary: {
                    fontFamily: FONT_FAMILIES_STYLES[type].fontFamily
                }
            })(ListItemText);
            localret.push(
                <FontsMenuItem
                    key={type}
                    selected={currentStyle.has(type)}
                    disabled={currentStyle.has(type)}
                    onMouseDown={(e)=>{
                        if (!e.target.disabled)
                            saveSelectionStateActionWrapper(dispatch)(null,DraftInlineStyleToggle({styleName:type, regexp: REGEXP_FONT_FAMILY_SUFFIKS, id:FindClosestToFocusEditorID()}))
                        //saveSelectionStateActionWrapper(onToggle)(null, type, REGEXP_FONT_FAMILY_SUFFIKS);
                    }}
                    type={FONT_FAMILIES_STYLES.type}>
                    <ListItemIcon>
                        <CreateOutlinedIcon fontSize="large"/>
                    </ListItemIcon>
                    <MyListItemText primary={`${type}`}/>
                </FontsMenuItem>
            )
        }
        return localret;
    },[]);

    if (shouldMenuSelectedItemUpdate) {
        let findNewSelectIndex = ret.findIndex((value) => currentStyle.has(value.key));
        if (findNewSelectIndex!==oldSelectedItem.indexinret) {//ЕСЛИ ЗАДИЗЭБЛИТЬ КНОПКИ МОЖНО НЕ ПРОВЕРЯТЬ ТАКИЕ УСЛОВИЯ И ПЕРЕДЕЛАТЬ
            if (oldSelectedItem.Elem) {
                let MyListItemText = withStyles({
                    primary: {
                        fontFamily: FONT_FAMILIES_STYLES[oldSelectedItem.Elem.key].fontFamily
                    }
                })(ListItemText);
                let oldProps = oldSelectedItem.Elem.props;
                ret[oldSelectedItem.indexinret] =
                    <FontsMenuItem  {...oldProps} selected={false} disabled={false} key={oldSelectedItem.Elem.key}>
                        <ListItemIcon>
                            <CreateOutlinedIcon fontSize="large"/>
                        </ListItemIcon>
                        <MyListItemText primary={`${oldSelectedItem.Elem.key}`}/>
                    </FontsMenuItem>
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
                <FontsMenuItem   {...newProps} selected={true} disabled={true} key={newkey}>
                    <ListItemIcon>
                        <CreateOutlinedIcon fontSize="large"/>
                    </ListItemIcon>
                    <MyListItemText primary={ret[findNewSelectIndex].key}/>
                </FontsMenuItem>
        }
    }
    return (
        <React.Fragment>
            {ret}
        </React.Fragment>
    );
});