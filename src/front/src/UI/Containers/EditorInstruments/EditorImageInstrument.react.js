import './EditorImageInstrument.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Slider from 'UI/Components/Slider/Slider.react'
import StateButtonTooltip from 'UI/Components/StateButton/StateButtonTooltip.react'

import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'

class EditorImageInstrument extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'EditorImageInstrument'
        this.bem = bem.with(this.blockName)
    }

    handleScaleChange(value) {
        const {editorOptions, imageFieldKey} = this.props
        const design = editorOptions.get("design").setIn([imageFieldKey, "scale", "value"], value).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleBlurRadiusChange(value) {
        const {editorOptions, imageFieldKey} = this.props
        const design = editorOptions.get("design").setIn([imageFieldKey, "blurRadius", "value"], value).toJS()
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    render() {
        const {title, editorOptions, imageFieldKey} = this.props
        const scale = editorOptions.getIn(["design", imageFieldKey, "scale"])
        const blurRadius = editorOptions.getIn(["design", imageFieldKey, "blurRadius"])

        return (
            <div className={this.bem()}>
                <h2 className={this.bem("Title")}>{title}</h2>
                <div className={this.bem("Control")}>
                    <StateButtonTooltip
                        value={(
                            <div className={this.bem("Control-Scale")}/>
                        )}
                    >
                        <h3 className={this.bem("Control-Title")}>
                            {`Scale: ${scale ? scale.get("value") : ""}x`}
                        </h3>
                        <Slider
                            disabled={!scale}
                            value={scale && scale.get("value")}
                            min={scale && scale.get("min")}
                            max={scale && scale.get("max")}
                            step={scale && scale.get("step")}
                            onChange={::this.handleScaleChange}
                        />
                    </StateButtonTooltip>
                </div>
                <div className={this.bem("Control")}>
                    <StateButtonTooltip
                        value={(
                            <div className={this.bem("Control-Drop")}/>
                        )}
                    >
                        <h3 className={this.bem("Control-Title")}>
                            {`Blur Radius: ${blurRadius ? blurRadius.get("value") : ""}%`}
                        </h3>
                        <Slider
                            disabled={!blurRadius}
                            value={blurRadius && blurRadius.get("value")}
                            min={blurRadius && blurRadius.get("min")}
                            max={blurRadius && blurRadius.get("max")}
                            step={blurRadius && blurRadius.get("step")}
                            onChange={::this.handleBlurRadiusChange}
                        />
                    </StateButtonTooltip>
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
)(EditorImageInstrument)
