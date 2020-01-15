import './App.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import MobileDetector from 'UI/Components/MobileDetector/MobileDetector.react'
import Wizard from 'UI/Containers/Wizard/Wizard.react'

class App extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'App'
        this.bem = bem.with(this.blockName)
    }

    render () {
        return (
            <MobileDetector>
                {({ isMobile }) => {
                    return <Wizard/>
                }}
            </MobileDetector>
        )
    }
}

export default App
