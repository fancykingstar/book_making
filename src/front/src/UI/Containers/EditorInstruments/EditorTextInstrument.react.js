import './EditorTextInstrument.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import TEXT_ALIGN_OPTIONS from 'Consts/TEXT_ALIGN_OPTIONS.const'
import TEXT_FONTS_ALL_CONST from 'Consts/TEXT_FONTS_ALL.const'

import SelectAlt from 'UI/Components/SelectAlt/SelectAlt.react'
import Slider from 'UI/Components/Slider/Slider.react'
import Input from 'UI/Components/Input/Input.react'
import { ChromePicker } from 'react-color'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import SwitcherOnOff from 'UI/Components/SwitcherOnOff/SwitcherOnOff.react'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'

import StateButton from 'UI/Components/StateButton/StateButton.react'
import StateButtonItem from 'UI/Components/StateButton/StateButtonItem.react'
import StateButtonTooltip from 'UI/Components/StateButton/StateButtonTooltip.react'

import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'

class EditorTextInstrument extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'EditorTextInstrument'
        this.bem = bem.with(this.blockName)

        const {textFieldKey} = this.props
        this.state = {
            text: props.editorOptions.getIn(["design", textFieldKey, "text"]),
            pickerActive: false,
        }
    }

    handleTextChange(event) {
        const text = event.target.value
        this.setState({
            text,
        })

        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design").setIn([textFieldKey, "text"], text)
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleFontChange(font) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design").setIn(["font"], font).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleFontSizeChange(fontSize) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design")
            .setIn([textFieldKey, "fontSize", "value"], fontSize)
            .setIn([textFieldKey, "fontSize", "type"], "custom").toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleFontSizeTypeChange(nextType) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design")
            .setIn([textFieldKey, "fontSize", "type"], nextType).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleAlignChange(textAlign) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design").setIn([textFieldKey, "textAlign"], textAlign).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleLetterSpaceChange(textLetterSpace) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design").setIn([textFieldKey, "textLetterSpace", "value"], textLetterSpace).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleShadowChange(textShadow) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design").setIn([textFieldKey, "textShadow", "on"], textShadow).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleTextLetterCaseChange(textLetterCase) {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design").setIn([textFieldKey, "textLetterCase", "on"], textLetterCase).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleColorChange({ hex }) {
        window.requestAnimationFrame(() => {
            const {editorOptions, textFieldKey} = this.props
            const design = editorOptions.get("design").setIn([textFieldKey, "color"], hex)
            this.props.EditorOptionsActions.update({
                design,
            })
        })
    }

    handleSetDefaultPosition() {
        const {editorOptions, textFieldKey} = this.props
        const design = editorOptions.get("design")
            .setIn([textFieldKey, "position"], editorOptions.getIn(["design", textFieldKey, "defaultPosition"]))
            .toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    render() {
        const {title, editorOptions, textFieldKey, placeholder} = this.props
        const {
            bookGenre,
        } = editorOptions.get("design").toJS()
        const {
            font,
            color,
            textAlign,
        } = editorOptions.getIn(["design", textFieldKey]).toJS()

        const fontSize = editorOptions.getIn(["design", textFieldKey, "fontSize"])
        const textLetterSpace = editorOptions.getIn(["design", textFieldKey, "textLetterSpace"])
        const textShadow = editorOptions.getIn(["design", textFieldKey, "textShadow"])
        const textLetterCase = editorOptions.getIn(["design", textFieldKey, "textLetterCase"])

        const selectedFont = {
            ...font,
            title: this.state.text,
        }

        const fontSizeValue = fontSize ? fontSize.get("type") == "auto" ? 1 : (fontSize.get("value") / fontSize.get("autoMin") / 2).toFixed(2) : ""

        return (
            <div className={this.bem()}>
                <h2 className={this.bem("Title")}>{title}</h2>
                <div className={this.bem("Controls")}>
                    <div className={this.bem("Control")}>
                        <input
                            id="outlined-name"
                            label="Text"
                            className={this.bem("Control-Input")}
                            value={this.state.text}
                            onChange={(...args) => this.handleTextChange(...args)}
                            margin="normal"
                            variant="outlined"
                            placeholder={placeholder}
                        />
                    </div>
                    <div className={this.bem("Control")}>
                        <StateButtonTooltip value={fontSizeValue}>
                            <h3 className={this.bem("Control-Title")}>
                                <span className={this.bem("Control-Title-Prefix")}>{`Font Size: ${fontSizeValue}x`}</span>
                                <FontAwesomeIcon
                                    icon={["fa", "times"]}
                                    className={this.bem("Control-Title-Cancel", {hidden:fontSize.get("type") == "auto"})}
                                    onClick={() => this.handleFontSizeTypeChange("auto")}
                                />
                            </h3>
                            <Slider
                                value={fontSize && fontSize.get("type") == "auto" ? fontSize.get("auto") : fontSize.get("value")}
                                min={fontSize && (fontSize.get("autoMin") || fontSize.get("min"))}
                                max={fontSize && (fontSize.get("autoMax") || fontSize.get("max"))}
                                step={fontSize && fontSize.get("step")}
                                onChange={(...args) => this.handleFontSizeChange(...args)}
                            />
                        </StateButtonTooltip>
                    </div>
                    <div className={this.bem("Control")}>
                        <StateButton>
                            {TEXT_ALIGN_OPTIONS.toJS().map((d, i, l) => (
                                <StateButtonItem
                                    key={d.id}
                                    id={d.id}
                                    selected={d.id == textAlign.id}
                                    onClick={() => this.handleAlignChange(i == (l.length - 1) ? l[0] : l[i+1])}
                                />
                            ))}
                        </StateButton>
                        {
                            // <SelectAlt
                            //     className={this.bem("Control-Select")}
                            //     options={TEXT_ALIGN_OPTIONS.toJS()}
                            //     selected={textAlign}
                            //     placeholder="Select align..."
                            //     label="Text Align"
                            //     labelWidth={70}
                            //     onChange={(...args) => this.handleAlignChange(...args)}
                            // />
                        }
                    </div>
                    <div className={this.bem("Control")}>
                        <StateButtonTooltip
                            value={(
                                <div className={this.bem("Control-Letter-Space")}>
                                    VA
                                </div>
                            )}
                        >
                            <h3 className={this.bem("Control-Title")}>
                                <span className={this.bem("Control-Title-Prefix")}>{`Text Letter Space: ${textLetterSpace ? textLetterSpace.get("value") : ""}px`}</span>
                            </h3>
                            <Slider
                                value={textLetterSpace && textLetterSpace.get("value")}
                                min={textLetterSpace && textLetterSpace.get("min")}
                                max={textLetterSpace && textLetterSpace.get("max")}
                                step={textLetterSpace && textLetterSpace.get("step")}
                                onChange={(...args) => this.handleLetterSpaceChange(...args)}
                            />
                        </StateButtonTooltip>
                    </div>
                    <div className={this.bem("Control")}>
                        <StateButton>
                            {[{on:true, id:"text-uppercase-on"}, {on:false, id:"text-uppercase-off"}].map(d => (
                                <StateButtonItem
                                    key={d.id}
                                    id={d.id}
                                    selected={textLetterCase && d.on == textLetterCase.get("on")}
                                    onClick={() => this.handleTextLetterCaseChange(!d.on)}
                                />
                            ))}
                        </StateButton>
                        {
                            // <Switch
                            //     checked={textLetterCase && textLetterCase.get("on")}
                            //     onChange={(...args) => this.handleTextLetterCaseChange(...args)}
                            //     value="text-uppercase"
                            //     color="primary"
                            //     inputProps={{ 'aria-label': 'primary checkbox' }}
                            // />
                        }
                    </div>
                    <div className={this.bem("Control")}>
                        <StateButton>
                            {[{on:true, id:"text-shadow-on"}, {on:false, id:"text-shadow-off"}].map(d => (
                                <StateButtonItem
                                    key={d.id}
                                    id={d.id}
                                    selected={textShadow && d.on == textShadow.get("on")}
                                    onClick={() => this.handleShadowChange(!d.on)}
                                />
                            ))}
                        </StateButton>
                        {
                            // <Switch
                            //     checked={textShadow && textShadow.get("on")}
                            //     onChange={(...args) => this.handleShadowChange(...args)}
                            //     value="text-shadow"
                            //     color="primary"
                            //     inputProps={{ 'aria-label': 'primary checkbox' }}
                            // />
                        }
                    </div>
                    <div className={this.bem("Control")}>
                        <div
                            className={this.bem("Control-Color-Cover", {visible:this.state.pickerActive})}
                            onClick={() => this.setState({
                                pickerActive:false,
                            })}
                        />
                        {
                            this.state.pickerActive
                                ? (
                                    <div className={this.bem("Control-Color-Picker")}>
                                        <ChromePicker
                                            color={{hex:color}}
                                            disableAlpha={true}
                                            onChange={(...args) => this.handleColorChange(...args)}
                                        />
                                    </div>
                                )
                                : null
                        }
                        <div
                            className={this.bem("Control-Color")}
                            onClick={() => this.setState(prevState => ({
                                pickerActive:true,
                            }))}
                        >
                            <span className={this.bem("Control-Color-Sample")} style={{backgroundColor:color}}/>
                        </div>
                    </div>
                    {
                        // <div className={this.bem("Control")}>
                        //     <h3
                        //         className={this.bem("Control-Button")}
                        //         onClick={(...args) => this.handleSetDefaultPosition(...args)}
                        //     >
                        //         Restore Default
                        //     </h3>
                        // </div>
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        editorOptions: EditorOptionsSelector({state}),
    }),
    dispatch => ({
        EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch),
    }),
)(EditorTextInstrument)
