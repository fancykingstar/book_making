import './Styles.less'
import React from 'react'
import bem from 'Helpers/Bem.helper'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default ({styles, selectedStyles, onSelect, maxSelected}) => {
    const b = bem.with("Styles")
    return (
        <ul className={b()}>
            {styles.map(style => {
                const selected = selectedStyles.some(s => s.id == style.id)
                const disabled = maxSelected && !selected
                return (
                    <li
                        key={style.id}
                        className={b("StyleBox", {selected, disabled})}
                    >
                        <div
                            className={b("Style")}
                            onClick={() => !disabled && onSelect(style)}
                            style={{
                                backgroundImage: `url(${style.src})`,
                            }}
                        />
                    </li>
                )
            })}
        </ul>
    )
}