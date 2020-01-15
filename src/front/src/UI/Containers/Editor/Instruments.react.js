import './Instruments.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'

class Instruments extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Instruments'
        this.bem = bem.with(this.blockName)

        this.state = {
            instrumentOptions: [
                {
                    id:0,
                    slug:"background",
                    title:"Background",
                    renderIcon: selected => (
                        <div className={this.bem("Background-Icon", {selected})}/>
                    )
                },
                {
                    id:1,
                    slug:"foreground",
                    title:"Foreground",
                    renderIcon: selected => (
                        <FontAwesomeIcon
                            icon="heart"
                            className={this.bem("Foreground-Icon", {selected})}
                        />
                    )
                },
                {
                    id:2,
                    slug:"title",
                    title:"Title",
                    renderIcon: selected => (
                        <div className={this.bem("Title-Icon", {selected})}>
                            T
                        </div>
                    )
                },
                {
                    id:3,
                    slug:"author",
                    title:"Author",
                    renderIcon: selected => (
                        <div className={this.bem("Author-Icon", {selected})}>
                            A
                        </div>
                    )
                },
                {
                    id:4,
                    slug:"subtitle",
                    title:"Subtitle",
                    renderIcon: selected => (
                        <div className={this.bem("Subtitle-Icon", {selected})}>
                            T
                        </div>
                    )
                },
            ],
        }
    }

   componentDidMount() {
       this.handleInstrumentChange(this.state.instrumentOptions[0])
   }

    handleInstrumentChange(instrument) {
        this.props.EditorOptionsActions.update({
            instrument,
        })
    }

    renderOption(option) {
        const {editorOptions, className} = this.props
        const instrument = editorOptions.get("instrument")
        const selected = instrument && instrument.get("slug") == option.slug
        return (
            <div
                key={option.id}
                className={this.bem("Item", {selected})}
                onClick={selected ? null : () => this.handleInstrumentChange(option)}
            >
                {option.renderIcon(selected)}
                {option.title}
            </div>
        )
    }

    render () {
        const {className, isMobile} = this.props
        return (
            <section className={classNames(this.bem({isMobile}), className)}>
                {
                    this.state.instrumentOptions.map(d => this.renderOption(d))
                }
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
)(Instruments)
