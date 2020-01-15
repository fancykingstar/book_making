import './Colors.less'
import React from 'react'
import bem from 'Helpers/Bem.helper'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default ({colors, selectedColor, onSelect}) => {
    const b = bem.with("Colors")
    return (
        <ul className={b()}>
            {colors.map(color => {
                const isException = (color.id == "white" || color.id == "grey" || color.id == "black")
                const exceptionColor = "#281A27"
                const boxColor = selectedColor && selectedColor.id == color.id ? isException ? exceptionColor : color.palette[2] : null
                return (
                    <li
                        key={color.id}
                        className={b("ColorBox")}
                    >
                        <div
                            className={b("Color")}
                            onClick={() => onSelect(color)}
                        >
                            <ol
                                className={b("Color-Palette")}
                                style={{
                                    boxShadow: boxColor && `0px 0px 10px 0px ${boxColor}`,
                                }}
                            >
                                {color.palette.map(shade => (
                                    <li
                                        key={shade}
                                        className={b("Color-Shade")}
                                        style={{
                                            backgroundColor: shade,
                                        }}
                                    />
                                ))}
                            </ol>
                            <h4
                                className={b("Color-Title")}
                                style={{
                                    color: selectedColor && selectedColor.id == color.id
                                        ? isException
                                            ? exceptionColor
                                            : color.palette[2]
                                        : null,
                                }}
                            >{color.title}</h4>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}