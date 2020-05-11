import {withStyles} from "@material-ui/core";
import {StandardConstrMenuStyle} from "../../styles/CommonComponentsStyles/CustomStylesMUIwithStyles";
import MenuItem from "@material-ui/core/MenuItem";

export const FontsMenuItem = withStyles((theme)=>StandardConstrMenuStyle(theme))(MenuItem);
export const PageTypeMenuItem = withStyles((theme)=>StandardConstrMenuStyle(theme))(MenuItem);

