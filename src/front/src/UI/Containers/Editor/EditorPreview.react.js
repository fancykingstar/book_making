import './EditorPreview.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Design from 'UI/Containers/Design/Design.react'
import BookCover3D from 'UI/Components/BookCover3D/BookCover3D.react'

import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'
import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'

class EditorPreview extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'EditorPreview'
        this.bem = bem.with(this.blockName)
        // this.setScale = this.setScale.bind(this)

        this.state = {
            scale: 1
        }

        this.onScroll = this.onScroll.bind(this);
    }
        
    onScroll() {
        this.forceUpdate()
    }

    render () {
        const {className, editorOptions, children, EditorOptionsActions, rotate3d, isMobile} = this.props
        // const width = isMobile ? 300 : 400
        // const height = isMobile ? 450 : 600
        const scale = isMobile ? 1/2 : 3/5
        return (
            <section className={classNames(this.bem(), className)}>
                <div className={this.bem("Controls")} style={{ width: (window.innerHeight - 180) * 0.66}}>
                    {children}
                </div>
                <BookCover3D
                    width={281} //(window.innerHeight - 180) * 0.66}
                    height={428}//window.innerHeight - 180}
                    action={rotate3d}
                >
                    <Design
                        ref={this.refDesign}
                        design={editorOptions.get("design")}
                        width={281}//(window.innerHeight - 180) * 0.66}
                        height={428}//window.innerHeight - 180}
                        scale={scale}
                        draggableId={editorOptions.getIn(["instrument", "slug"])}
                        EditorOptionsActions={EditorOptionsActions}
                    />
                </BookCover3D>
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
)(EditorPreview)
