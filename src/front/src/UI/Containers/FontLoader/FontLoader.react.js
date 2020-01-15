import './FontLoader.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import TEXT_FONTS_ALL from 'Consts/TEXT_FONTS_ALL.const'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import FontsSelector from 'Redux/Selectors/Fonts/Fonts.selector'
import * as FontsActions from 'Redux/Actions/Fonts/Fonts.actions'

class FontLoader extends Component {
    loaded = {}

    constructor(props) {
        super(props)
        this.blockName = 'FontLoader'
        this.bem = bem.with(this.blockName)
    }

    componentDidMount() {
        this.filterFonts()
    }

    componentDidUpdate() {
        this.filterFonts()
    }

    filterFonts() {
        let {fontsStatus, fonts2load} = this.props
        fonts2load = fontsStatus ? fonts2load.filter(f => !fontsStatus.get(f)) : fonts2load
        fonts2load = fonts2load
                .map(slug => TEXT_FONTS_ALL.find(f => f.get("slug") == slug) || "")
                .map(d => d && d.get("name"))
                .filter(d => d)

        if (fonts2load.length) {
            this.loadFont(fonts2load)
        }
    }

    setLoaded(fontName) {
        const {fontsActions} = this.props
        const font = TEXT_FONTS_ALL.find(f => f.get("name") == fontName)

        if (!font)
            return

        fontsActions.update({
            [font.get("slug")]: {
                loaded: true,
            }
        })
    }

    loadFont(families) {
        families = families.filter(f => {
            if (this.loaded[f])
                return false
            return this.loaded[f] = true
        })

        if (!families.length)
            return

        window.WebFont.load({
            google: {
                families,
            },
            fontactive: fontName => this.setLoaded(fontName),
        })
    }

    render() {
        return this.props.children
    }
}

export default connect(
    state => ({
        fontsStatus: FontsSelector({state}),
    }),
    dispatch => ({
        fontsActions: bindActionCreators(FontsActions, dispatch),
    }),
)(FontLoader)
