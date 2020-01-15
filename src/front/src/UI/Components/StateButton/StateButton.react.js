import './StateButton.less'
import React, { Component } from 'react'
import bem from 'Helpers/Bem.helper'

export default class StateButton extends Component {
    constructor(props) {
        super(props)
        this.blockName = 'StateButton'
        this.bem = bem.with(this.blockName)
    }
    
     render() {
         const {children} = this.props
         return (
            <div className={this.bem()}>
                {children}
            </div>
         )
     }
}
