import './SwitcherOnOff.less'

import React from 'react'
import bem from 'Helpers/Bem.helper'

export default props => {
    const b = bem.with("SwitcherOnOff")
    const {on, onChange} = props
    return (
        <div className={b()}>
            <div
                className={b("Item", {active:!!on})}
                onClick={() => onChange(true)}
            >On</div>
            <div
                className={b("Item", {active:!on})}
                onClick={() => onChange(false)}
            >Off</div>
        </div>
    )
}
