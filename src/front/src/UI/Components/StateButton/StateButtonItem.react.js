import './StateButtonItem.less'
import React, { Component } from 'react'
import bem from 'Helpers/Bem.helper'

import TEXT_ALIGN_OPTIONS from 'Consts/TEXT_ALIGN_OPTIONS.const'

export default class StateButtonItem extends Component {
    constructor(props) {
        super(props)
        this.blockName = 'StateButtonItem'
        this.bem = bem.with(this.blockName)
    }

    renderIcon() {
        const {id} = this.props
        let name = ""
        switch (id) {
            case "center":
            case "left":
            case "right":
                name = `text-align-${id}`
                break
            case "text-shadow-on":
            case "text-shadow-off":
                name = id
                break
            case "text-uppercase-on":
            case "text-uppercase-off":
                name = id
                break
        }
        return (
            <div className={this.bem("Icon", {name})}/>
        )
    }
    
    render() {
        const {selected, onClick} = this.props
        if (!selected)
            return null

        return (
            <div className={this.bem()} onClick={onClick}>
                {this.renderIcon()}
            </div>
        )
    }
}
