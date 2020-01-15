import './SubTitle.less'
import React from 'react'

import classNames from 'classnames'

export default ({ className, children }) => (
    <h3 className={classNames("SubTitle", className)}>
        {children}
    </h3>
)
