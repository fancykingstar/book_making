import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import MobileDetect from 'mobile-detect'

export default class MobileDetector extends Component {
    constructor (props) {
        super(props)
        this.boxClassName = 'MobileDetector'
        this.bem = bem.with(this.boxClassName)

        this.state = {
            mobileDetect: new MobileDetect(window.navigator.userAgent),
        }

        this.handleResize = ::this.handleResize
    }

    handleResize() {
        this.setState({
            mobileDetect: new MobileDetect(window.navigator.userAgent),
        })
    }

    componendDidMount() {
        window.addEventListener("resize", this.handleResize, false)
    }

    componendWillUnmount() {
        window.removeEventListener("resize", this.handleResize)
    }

    render () {
        const {children} = this.props
        const isMobile = !!(this.state.mobileDetect.mobileGrade() === 'A' && this.state.mobileDetect.mobile())

        return children({
            isMobile,
        })
    }
}
