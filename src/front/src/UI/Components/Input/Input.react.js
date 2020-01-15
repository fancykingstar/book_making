import './Input.less'
import React from 'react'
import bem from 'Helpers/Bem.helper'

import Form from 'react-bootstrap/Form'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default props => {
    const b = bem.with("Input")
    const {placeholder, value, onChange, acceptableValue, groupStyle} = props
    const refInput = React.createRef()
    return (
        <Form.Group
            className={b()}
            style={groupStyle}
        >
            <Form.Control
                ref={refInput}
                className={b("Input", {selected:value.length > 0})}
                placeholder={placeholder}
                value={value}
                onChange={() => onChange(refInput.current.value)}
            />
            <FontAwesomeIcon
                icon="check"
                className={b("Check", {active:acceptableValue})}
            />
        </Form.Group>
    )
}
