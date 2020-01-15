import './Tools.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import EditorImageInstrument from 'UI/Containers/EditorInstruments/EditorImageInstrument.react'
import EditorTextInstrument from 'UI/Containers/EditorInstruments/EditorTextInstrument.react'

import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'

class Tools extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Tools'
        this.bem = bem.with(this.blockName)
    }

    renderSwitcher() {
        const {editorOptions} = this.props

        if (editorOptions.getIn(["instrument", "slug"]) == "background")
            return (
                <h2 className={this.bem("Section-Title")}>Background Image Variations</h2>
            )

        if (editorOptions.getIn(["instrument", "slug"]) == "foreground")
            return (
                <EditorImageInstrument
                    key="foreground"
                    className={this.bem("Controls")}
                    imageFieldKey="foregroundImage"
                    title={"Foreground Image Variations"}
                />
            )

        if (editorOptions.getIn(["instrument", "slug"]) == "title")
            return (
                <EditorTextInstrument
                    key="bookTitle"
                    className={this.bem("Controls")}
                    textFieldKey="bookTitle"
                    placeholder="Enter your book title"
                    title={"Title Variations"}
                />
            )

        if (editorOptions.getIn(["instrument", "slug"]) == "author")
            return (
                <EditorTextInstrument
                    key="authorName"
                    className={this.bem("Controls")}
                    textFieldKey="authorName"
                    placeholder="Enter author's name"
                    title={"Author's Name Variations"}
                />
            )

        if (editorOptions.getIn(["instrument", "slug"]) == "subtitle")
            return (
                <EditorTextInstrument
                    key="subTitle"
                    className={this.bem("Controls")}
                    textFieldKey="subTitle"
                    placeholder="Enter sub title"
                    title={"Sub Title Variations"}
                />
            )

        return null
    }

    render () {
        const {className} = this.props
        return (
            <section className={classNames(this.bem(), className)}>
                {this.renderSwitcher()}
            </section>
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
)(Tools)
