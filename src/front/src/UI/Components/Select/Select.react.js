import './Select.less'
import React from 'react'
import classNames from 'classnames'
import bem from 'Helpers/Bem.helper'

import Form from 'react-bootstrap/Form'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default props => {
    const b = bem.with("Select")
    const {className, options, placeholder, selected, onChange, acceptableValue, selectStyle, disabled} = props
    const refInput = React.createRef()
    return (
        <Form.Group className={classNames(b(), className)}>
            <Form.Control
                ref={refInput}
                className={b("Select", {selected:acceptableValue})}
                as="select"
                value={selected ? selected.id : ""}
                onChange={() => onChange(options.filter(d => d.id == refInput.current.value)[0])}
                style={selectStyle}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map(d => (
                    <option key={d.id} value={d.id}>
                        {d.title}
                    </option>
                ))}
            </Form.Control>
            <FontAwesomeIcon
                icon="check"
                className={b("Check", {active:acceptableValue})}
            />
        </Form.Group>
    )
}
