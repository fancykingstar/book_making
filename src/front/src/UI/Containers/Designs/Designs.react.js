import './Designs.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import MasterDesignsHelper from 'Helpers/MasterDesigns.helper'

import Design from 'UI/Containers/Design/Design.react'

class Designs extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Designs'
        this.bem = bem.with(this.blockName)

        this.state = {
            designs: null,
        }
    }

    getDesigns() {
        return new MasterDesignsHelper(this.props).getOptions()
    }

    componentDidMount() {
        this.setState({
            designs: this.getDesigns(),
        })
    }

    componentWillReceiveProps() {
        if (this.getDesigns().size === 0) {
            return
        }

        this.setState({
            designs: this.getDesigns(),
        })
    }

    componentDidUpdate() {
        if (this.getDesigns().size === 0) {
            return
        }
        
        const {shouldUpdate} = this.props

        if(shouldUpdate) {
            this.setState({
                designs: null,
            })
            setTimeout(() => {
                this.setState({
                    designs: this.getDesigns(),
                })
            })
        }
    }

    render () {
        const { width, height, scale, limit, className, children, hoverEffect } = this.props

        let {designs} = this.state
        if (designs && limit) {
            designs = designs.slice(0, limit)
        }

        return (
            <div className={classNames(this.bem(), className)}>
                <ul className={this.bem("List")}>
                    {!this.props.loading && designs
                        ? designs.map((d, index) => (
                            <li
                                key={index}
                                className={this.bem("Item")}
                            >
                                <Design
                                    design={d}
                                    onClick={() => this.props.onClick(d)}
                                    width={width}
                                    height={height}
                                    scale={scale}
                                    hoverEffect={hoverEffect}
                                />
                            </li>
                        ))
                        : [...Array(limit)].map((e, i) =>
                            <li
                                key={i}
                                className={this.bem("Item")}
                                
                            >
                                <div className={this.bem("Placeholder")} style={{ width, height }}>
                                    <img src="/images/gifs/loading.gif" />
                                </div>
                            </li>)
                    }
                </ul>
                {
                    (designs && designs.size > limit)
                        ? children
                        : null
                }
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({}),
)(Designs)
