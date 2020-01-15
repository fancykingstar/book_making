import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import posed from 'react-pose'

class DraggableBox extends Component {

    transform = {}

    DynamicBox = posed.div({
        initial: {
            x: ({x}) => x,
            y: ({y}) => y,
            scale: ({scale}) => scale,
        },
        draggable: true,
        dragBounds: ({active, x, y}) => active ? {} : {top:y,right:x,bottom:y,left:x},
    })

    StaticBox = ({className, style, x, y, scale, children}) => (
        <div
            className={className}
            style={{
                transform: `translateX(${x}${isNaN(y) ? "" : "px"}) translateY(${y}${isNaN(y) ? "" : "px"}) translateZ(0px) scale(${scale})`,
                ...style,
            }}
        >
            {children}
        </div>
    )

    constructor(props) {
        super(props)
        this.blockName = 'DraggableBox'
        this.bem = bem.with(this.blockName)
    }

    handleDragEnd() {
        const {active} = this.props
        if (!active)
            return

        this.props.handleChange(this.transform)
    }

    render() {
        const {className, active, children, x, y, scale, style} = this.props
        const Box = active ? this.DynamicBox : this.StaticBox
        return (
            <Box
                key={`${x}${y}`}
                className={classNames(className)}
                pose="initial"
                poseKey={scale}
                active={active}
                onValueChange={{
                    x: x => this.transform.x = this.props.active ? x : this.transform.x,
                    y: y => this.transform.y = this.props.active ? y : this.transform.y,
                }}
                onDragEnd={::this.handleDragEnd}
                style={style}
                x={x}
                y={y}
                scale={scale || 1}
            >
                {children}
            </Box>
        )
    }
}

export default DraggableBox
