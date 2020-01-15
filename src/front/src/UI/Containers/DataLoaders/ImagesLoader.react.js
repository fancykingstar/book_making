import React, { Component } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class ImageLoader extends Component {
    constructor (props) {
        super(props)
        this.state = {}
    }

    componentDidUpdate() {
        
    }

    render () {
        return null
    }
}

export default connect(
    state => ({}),
    dispatch => ({}),
)(ImageLoader)
