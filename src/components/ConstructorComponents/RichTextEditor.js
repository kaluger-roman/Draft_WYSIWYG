import * as St from './../styles/ConstructorStyles/RichTextEditorStyle.module.css';
import React, {useMemo, useRef} from "react";
import {
    EditorState,
    RichUtils,
    getDefaultKeyBinding,
    CompositeDecorator,
} from 'draft-js';
import * as Immutable from 'immutable'
import {inlineStyleMap} from "../styles/ConstructorStyles/DraftStyles/INLINE_DRAFT_STYLES_JS";
import DropMenuMaterialUi from "../CommonComps/AuxiliaryComps/DropMenuMaterialUi";
import {DraftMainContext} from "../CommonComps/Service&SAGA/Contexts";
import {ItalicBoldStylesFont} from "../CommonComps/MenuItemsListsCollection/ItalicBoldStylesFont";
import {
    COLOR_BG_FILL_PICKER,
    COLOR_PICKER, FIELDS_PROPS,
    FONT_FAMILY_PICKER,
    FONT_SIZE_PICKER, PAPER_ORIENTATION, PAPER_TYPES, TABLE_ENTITY_TYPE
} from "../styles/ConstructorStyles/DraftStyles/NAMING_CONSTANTS";
import {SaveToPcButton} from "../CommonComps/AuxiliaryComps/SaveToPC_BTN";
import './../styles/ConstructorStyles/GlobalDraftStyles.css'

import DraftEditorContainer from "../CommonComps/DraftEditorContainer";
import {ClearInlineStylesOfSuffiksEachCharacter} from "../CommonComps/Service&SAGA/DraftUtils/ClearInlineStylesOfSuffiksEachCharacter";
import {ScalePropsBlock} from "../CommonComps/AuxiliaryComps/ScalePropsBlock";
import {StatsInfoBlock} from "../CommonComps/AuxiliaryComps/StatsInfoBlock";
import {TableManageBlock} from "../CommonComps/EmbedElements/Tables/TableManageBlock";
import {TableEmbedElement} from "../CommonComps/EmbedElements/Tables/TableEmbedElementV1";
import {_toggleInlineStyle} from './../CommonComps/Service&SAGA/DraftUtils/ToggleInlineStyle'
import {MapKeyToEditorCommandFactory} from "../CommonComps/Service&SAGA/DraftUtils/MapKeyToEditorCommand";
import { BlockRendererFnFactory} from "../CommonComps/Service&SAGA/DraftUtils/BlockRendererFunction";
import {SaveSelectionStateActionWrapperFactory} from "../CommonComps/Service&SAGA/DraftUtils/SaveSelectionStateActionWrapper";
import {HandleKeyCommandFactory} from "../CommonComps/Service&SAGA/DraftUtils/HandleKeyCommand";
import {ToggleBlockTypeFactory} from "../CommonComps/Service&SAGA/DraftUtils/SmallEditorUtils";

const nativeSelectionExtend = Selection.prototype.extend;

Selection.prototype.extend = function (...args) {
    try {
        return nativeSelectionExtend.apply(this, args);
    } catch (error) {
        console.log('Selection error.', error);
    }
};

/*const _addRange = Selection.prototype.addRange;
Selection.prototype.addRange = function() {
    _addRange.apply(this, arguments);

    if (this.rangeCount === 0) {
        _addRange.apply(this, arguments);
    }
}*/
/*if (Selection.prototype.extend.toString().includes('[native code]')) {
    const nativeSelectionExtend = Selection.prototype.extend;

    Selection.prototype.extend = function (...args) {
        try {
            return nativeSelectionExtend.apply(this, args);
        } catch (error) {
            console.log('Selection error.', error);
        }
    };
}*/


export class RichTextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(new CompositeDecorator([
                {
                    strategy: findLinkEntities,
                    component: (props) => <Link {...props} editorState={this.state.editorState}/>,
                },
            ])),
            EditorReadOnly: false,
        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle =_toggleInlineStyle.bind(this);
        this.onChange = editorState =>this.setState({editorState});
        this.promptForLink = this._promptForLink.bind(this);
        this.onURLChange = (e) => this.setState({urlValue: e.target.value});
        this.confirmLink = this._confirmLink.bind(this);
        this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
        this.removeLink = this._removeLink.bind(this);
        this.blockRendererFn = this.blockRendererFn.bind(this);
        this.saveSelectionStateActionWrapper=this._saveSelectionStateActionWrapper.bind(this);
        this.toggleEditorReadOnly = this.toggleEditorReadOnly.bind(this);

    this.contextvalue={
        saveSelectionStateActionWrapper: this.saveSelectionStateActionWrapper,
       }
    }

    _saveSelectionStateActionWrapper(wrapFunc){
        return SaveSelectionStateActionWrapperFactory(this.state, this.onChange)(wrapFunc);
    }
    //////////////////////////////
    _promptForLink(e) {
        e.preventDefault();
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const startKey = editorState.getSelection().getStartKey();
            const startOffset = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

            let url = '';
            if (linkKey) {
                const linkInstance = contentState.getEntity(linkKey);
                url = linkInstance.getData().url;
            }

            this.setState({
                showURLInput: true,
                urlValue: url,
            }/*, () => {
                setTimeout(() => this.refs.url.focus(), 0);
            }*/);
        }
    }

    _confirmLink(e) {
        e.preventDefault();
        const {editorState, urlValue} = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue}
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
        this.setState({
            editorState: RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            ),
            showURLInput: false,
            urlValue: '',
        });
    }

    _onLinkInputKeyDown(e) {
        if (e.which === 13) {
            this._confirmLink(e);
        }
    }

    _removeLink(e) {
        e.preventDefault();
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            this.setState({
                editorState: RichUtils.toggleLink(editorState, selection, null),
            });
        }
    }

    /////////////////////////
    _handleKeyCommand(command, editorState) {
       return HandleKeyCommandFactory(this.onChange)(command,editorState);
    }

    _mapKeyToEditorCommand(e) {
       return  MapKeyToEditorCommandFactory(this.state, this.onChange)(e);
    }

    _toggleBlockType(blockType) {
        return ToggleBlockTypeFactory(this.state, this.onChange)(blockType)
    }

     blockRendererFn(contentBlock) {
        return  BlockRendererFnFactory(this.state, this.toggleEditorReadOnly)( contentBlock);
    }
    toggleEditorReadOnly(readonly) {
        this.setState({EditorReadOnly: readonly});
    }

    render() {
        const {editorState} = this.state;
        ///////////////
        let urlInput;
        if (this.state.showURLInput) {
            urlInput =
                <div style={styles.urlInputContainer}>
                    <input
                        onChange={this.onURLChange}
                        ref="url"
                        style={styles.urlInput}
                        type="text"
                        value={this.state.urlValue}
                        onKeyDown={this.onLinkInputKeyDown}
                    />
                    <button onMouseDown={this.confirmLink}>
                        Confirm
                    </button>
                </div>;
        }

        ////////////////аккуратно, может сломать всю мемоизацию
        return (
            <DraftMainContext.Provider value={this.contextvalue}>
            <div className={`${St.EditorContainer}`}>
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                    promptForLink={this.promptForLink}
                    removeLink={this.removeLink}
                    onChange={this.onChange}
                />
                {urlInput}
               <DraftEditorContainer
                   textAlignment='left'
                   blockStyleFn={blockStyleFn}
                   customStyleMap={inlineStyleMap}
                   editorState={editorState}
                   handleKeyCommand={this.handleKeyCommand}
                   keyBindingFn={this.mapKeyToEditorCommand}
                   onChange={this.onChange}
                   readOnly={this.state.EditorReadOnly}
                   blockRendererFn={this.blockRendererFn}
               />
            </div>
            </DraftMainContext.Provider>
        );
    }
}

function blockStyleFn(block) {
    switch (block.getType()) {
        case 'unstyled':
            return  `${St.blockStyleFnUnStyledBlockType}`
        default:
            return null;
    }
}


class StyleButton extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.type);
        };
    }

    render() {
        let className = `${St.RichEditorstyleButton}`;
        if (this.props.active) {
            className += `  ${St.RichEditoractiveButton}`;
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}


const BLOCK_TYPES = [
    {label: 'H1', blocktype: 'header-one'},
    {label: 'H2', blocktype: 'header-two'},
    {label: 'H3', blocktype: 'header-three'},
    {label: 'H4', blocktype: 'header-four'},
    {label: 'H5', blocktype: 'header-five'},
    {label: 'H6', blocktype: 'header-six'},
    {label: 'Blockquote', blocktype: 'blockquote'},
    {label: 'UL', blocktype: 'unordered-list-item'},
    {label: 'OL', blocktype: 'ordered-list-item'},
    {label: 'Code Block', blocktype: 'code-block'},
    {label: 'ExampleBlock', blocktype: 'exampleblocktype'},

];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className={`${St.RichEditorcontrols}`}>
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.blocktype === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    type={type.blocktype}
                />
            )}
        </div>
    );
};


const InlineStyleControls = React.memo((props) => {
   const currentStyle = props.editorState.getCurrentInlineStyle();//вообще говоря возвращает набор стилей для самого левого края выделения
   const {onChange, editorState}=props;
    return (
        <div className={`${St.RichEditorcontrols}`}>

           < DropMenuMaterialUi onToggle={props.onToggle}
                                currentStyle={currentStyle}
                                menuType={FONT_FAMILY_PICKER}
           />
            < DropMenuMaterialUi onToggle={props.onToggle}
                                 currentStyle={currentStyle}
                                 menuType={COLOR_PICKER}
            />
            < DropMenuMaterialUi onToggle={props.onToggle}
                                 currentStyle={currentStyle}
                                 menuType={FONT_SIZE_PICKER}
            />
            < DropMenuMaterialUi onToggle={props.onToggle}
                                 currentStyle={currentStyle}
                                 menuType={COLOR_BG_FILL_PICKER}
            />
            < DropMenuMaterialUi onToggle={props.onToggle}
                                 currentStyle={currentStyle}
                                 menuType={FIELDS_PROPS}
            />
            < DropMenuMaterialUi onToggle={props.onToggle}
                                 currentStyle={currentStyle}
                                 menuType={PAPER_TYPES}
            />
            < DropMenuMaterialUi onToggle={props.onToggle}
                                 currentStyle={currentStyle}
                                 menuType={PAPER_ORIENTATION}
            />
            <ItalicBoldStylesFont
                onToggle={props.onToggle}
                currentStyle={currentStyle}
            />
            <SaveToPcButton
                editorState={props.editorState}
            />
            <StatsInfoBlock editorState={props.editorState}/>
            <ScalePropsBlock/>
            <TableManageBlock editorState={editorState} onChange={onChange}/>
            <button
                onMouseDown={props.promptForLink}
                style={{marginRight: 10}}>
                Add Link
            </button>
            <button onMouseDown={props.removeLink}>
                Remove Link
            </button>
        </div>
    );
});

/////////////
function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}


const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (

        <a href={url} style={styles.link}
/*
           contentEditable="false"
*/


                                                                  /*  onBeforeInput={()=>alert('input')}*/
                                                                  /*  onChange={()=>alert('change')}*/

        /*     onBeforeInputCapture={()=>alert('inputcaptur')}*/
          /* onMouseEnter={() => props.toggleEditorReadOnly(true)}
           onMouseLeave={() => props.toggleEditorReadOnly(false)}*/>
            <span  onFocus={()=>alert('focus')}
                   onSelect={()=>alert('focus')}
                   onInput={()=>alert('focus')}
                   onBeforeInput={()=>alert('focus')}
                   onKeyDown={()=>alert('focus')}


                /*  contentEditable="false" */
                style={{ display:'inline'}}>
            {props.children}
            </span>
        </a>

    );
};

////////////
const styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        padding: 20,
        width: 600,
    },
    buttons: {
        marginBottom: 10,
    },
    urlInputContainer: {
        marginBottom: 10,
    },
    urlInput: {
        fontFamily: '\'Georgia\', serif',
        marginRight: 10,
        padding: 3,
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
    link: {
        color: '#3b5998',
        textDecoration: 'underline',
        height:"7vmin",
        display: 'inline',
        lineHeight:'50px',
        fontSize: '10px',
        backgroundColor: "#984b69",
        borderColor: "#343A40",
       /* padding:"1vmin",
        margin:"1vmin",*/
        position:"relative",
borderWidth: "0.3vmin",
borderStyle: "solid",
borderRadius: "2vmin",
    },
};