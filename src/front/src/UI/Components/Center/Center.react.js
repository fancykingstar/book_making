import './Center.less'
import React from 'react'

export default props => (
    <div className="Center" style={props.style}>
        {props.children}
    </div>
)
