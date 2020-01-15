import './BookCover3D.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'

class BookCover3D extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'BookCover3D'
        this.bem = bem.with(this.blockName)
        
        this.onScroll = this.onScroll.bind(this);
        this.contentRef = React.createRef()

        window.addEventListener('resize', this.onScroll)

        this.state = {
            scale: 1
        }
    }

    componentDidMount() {
        this.onScroll()
    }
    
    onScroll() {
        if (this.contentRef.current) {
            const scale = (window.innerHeight - 180) / this.contentRef.current.clientHeight
            // this.props.setScale(scale * this.props.width)
            this.setState({ scale })
        }
    }

    render () {
        const {children, width, height, action} = this.props
        const {scale} = this.state
        
        return (
            <div
                className={this.bem({action})}
                style={{
                    width,
                    height,
                    marginTop: '20px',
                    transformOrigin: 'top left',
                    transform: `scale(${scale})`
                }}
                >
                <span className={this.bem("Book", {action})}/>
                <span
                    ref={this.contentRef}
                    className={this.bem("Content", {action})}
                    style={{
                        width,
                        height,
                    }}
                >
                    {children}
                </span>
            </div>
        )
    }
}

export default BookCover3D
