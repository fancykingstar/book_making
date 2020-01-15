import './Textarea.less'
import React from 'react'
import bem from 'Helpers/Bem.helper'

import Form from 'react-bootstrap/Form'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default props => {
    const b = bem.with("Textarea")
    const {placeholder, value, onChange, minSymbols, maxSymbols, acceptableValue} = props
    const refInput = React.createRef()
    return (
        <Form.Group className={b()}>
            <div className={b("Labels-Box")}>
                <Form.Label className={b("Label-Prefix")}>{`${minSymbols} min symbols`}</Form.Label>
                <Form.Label className={b("Label-Postfix")}>{`${maxSymbols - value.length} characters left`}</Form.Label>
            </div>
            <Form.Control
                ref={refInput}
                className={b("Textarea", {selected:value.length > 0})}
                as="textarea"
                rows="6"
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                placeholder={placeholder}
                value={value}
                onChange={() => {
                    const value = refInput.current.value
                    if (value.length > maxSymbols)
                        return
                    onChange(refInput.current.value)}
                }
            />
            <FontAwesomeIcon
                icon="check"
                className={b("Check", {active:acceptableValue})}
            />
        </Form.Group>
    )
}
