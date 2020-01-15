import './SelectAlt.less'
import React from 'react'
import classNames from 'classnames'
import bem from 'Helpers/Bem.helper'

import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select from '@material-ui/core/Select'

export default props => {
    const b = bem.with("Select")
    const {className, label, labelWidth, options, placeholder, selected, onChange, acceptableValue, disabled} = props
    const refInput = React.createRef()
    return (
        <FormControl variant="outlined" className={classNames(b(), className)}>
            <InputLabel htmlFor="outlined-native-simple">
                {label}
            </InputLabel>
            <Select
                ref={refInput}
                native
                className={b("Select", {selected:acceptableValue})}
                value={selected ? selected.id : ""}
                onChange={event => onChange(options.filter(d => d.id == event.target.value)[0])}
                disabled={disabled}
                input={
                    <OutlinedInput name="select" labelWidth={labelWidth} id="outlined-native-simple" />
                }
            >
                <option value="">{placeholder}</option>
                {options.map(d => (
                    <option key={d.id} value={d.id}>
                        {d.title}
                    </option>
                ))}
            </Select>
      </FormControl>
    )
}
