import './Footer.less'
import React from 'react'
import bem from 'Helpers/Bem.helper'

export default props => {
    const {hasNext, activeNext, hasSkip, activeSkip, onNextClick} = props
    const b = bem.with("Footer")
    return (
        <div className={b()}>
            <button
                className={b("SkipButton", {visible:hasSkip, active:activeSkip})}
                onClick={activeSkip ? onNextClick : () => {}}
                onKeyPress={target => target.charCode == 13 && activeSkip && onNextClick()}
            >
                Skip
            </button>
            <button
                className={b("NextButton", {visible:hasNext, active:activeNext})}
                onClick={activeNext ? onNextClick : () => {}}
                onKeyPress={target => target.charCode == 13 && activeNext && onNextClick()}
            >
                Continue
            </button>
        </div>
    )
}
