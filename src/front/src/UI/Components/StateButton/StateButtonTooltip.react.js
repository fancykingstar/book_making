import './StateButtonTooltip.less'
import React, { Component } from 'react'
import bem from 'Helpers/Bem.helper'
import Popup from "reactjs-popup"

export default class StateButtonTooltip extends Component {
    state={
        active: false,
    }

    constructor(props) {
        super(props)
        this.blockName = 'StateButtonTooltip'
        this.bem = bem.with(this.blockName)
    }

    renderValue() {
        const {value} = this.props
        return (
            <div
                className={this.bem("Value")}
                onClick={() => this.setState(prevState => ({
                    active: !prevState.active,
                }))}
            >
                {value}
            </div>
        )
    }

    renderTooltip() {
        const {children} = this.props
        const {active} = this.state
        return (
            <div className={this.bem("Tooltip", {active})}>
                {children}
            </div>
        )
    }
    
     render() {
         return (
            <div className={this.bem()}>
                <Popup
                    trigger={open => this.renderValue()}
                    position="bottom center"
                    closeOnDocumentClick
                >
                    {this.renderTooltip()}
                </Popup>
            </div>
         )
     }
}
