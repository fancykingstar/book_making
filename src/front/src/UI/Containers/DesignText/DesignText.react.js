import './DesignText.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import fitty from 'fitty'

import FontsSelector from 'Redux/Selectors/Fonts/Fonts.selector'

class DesignText extends Component {
    constructor(props) {
        super(props)
        this.blockName = 'DesignText'
        this.bem = bem.with(this.blockName)
        this.refRoot = React.createRef()

        this.handleFit = (...args) => this._handleFit(...args)
    }

    componentDidMount() {
        const {options} = this.props
        this.f = fitty(this.refRoot.current, options)
        this.refRoot.current.addEventListener('fit', this.handleFit)
    }

    componentDidUpdate({letterSpacing:prevLetterSpacing, textTransform:prevTextTransfrom, font:prevFont, fontsStatus:prevFontsStatus}) {
        const {options} = this.props
        const {letterSpacing, textTransform, font, fontsStatus} = this.props
        const hasBeenLoaded = !prevFontsStatus || prevFontsStatus.getIn([font.get("slug"), "loaded"]) != fontsStatus.getIn([font.get("slug"), "loaded"])

        if (prevLetterSpacing != letterSpacing || prevTextTransfrom != textTransform || prevFont != font || hasBeenLoaded)
            this.f.fit()
    }

    componentWillUnmount() {
        this.refRoot.current.removeEventListener('fit', this.handleFit)
    }

    _handleFit(event) {
        const {newValue} = event.detail
        const {onChangeFontSize} = this.props
        if (!onChangeFontSize)
            return

        onChangeFontSize(parseInt(newValue || 0))
        this.forceUpdate()
        // this.refRoot.current.style.setProperty("font-size", `${newValue - 3}px`)
    }

    render() {
        const {className, boxStyle, textStyle, children} = this.props

        return (
            <div
                className={classNames(this.bem(), className)}
                style={boxStyle}
            >
                <div
                    ref={this.refRoot}
                    className={this.bem("SpanBox")}
                >
                    <div
                        style={{ ...textStyle, marginTop: textStyle.fontSize, whiteSpace: textStyle.fontSize ? '' : 'nowrap' }}
                        className={this.bem("SpanInner")}
                    >
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        fontsStatus: FontsSelector({state}),
    }),
    dispatch => ({}),
)(DesignText)
