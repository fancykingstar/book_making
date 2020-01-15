import './Slider.less'
import 'rc-slider/assets/index.css'

import React from 'react'
import bem from 'Helpers/Bem.helper'

import Slider from 'rc-slider'

export default props => {
    const b = bem.with("Slider")
    const refInput = React.createRef()
    return (
        <Slider
            className={b()}
            {...props}
        />
    )
}
