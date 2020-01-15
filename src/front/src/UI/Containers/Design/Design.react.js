import './Design.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'
import Config from 'Config/Config'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import fitty from 'fitty'

import { getBoxJustifyContentByLocations } from 'Helpers/MasterDesigns.helper'

import DraggableBox from 'UI/Components/DraggableBox/DraggableBox.react'
import FontLoader from 'UI/Containers/FontLoader/FontLoader.react'
import DesignText from 'UI/Containers/DesignText/DesignText.react'

class Design extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Design'
        this.bem = bem.with(this.blockName)
    }

    renderForeground() {
        const {design, width, height, scale, draggableId, onClick, EditorOptionsActions} = this.props
        const active = draggableId == "foreground"
        const blurRadius = design.getIn(["foregroundImage", "blurRadius", "value"])
        const blurMask = `radial-gradient(#000 ${100 - blurRadius}%,hsla(0, 0%, 0%, 0) ${150 - blurRadius}%)`
        
        return (
            <DraggableBox
                active={active}
                className={classNames(this.bem("DraggableBox", {active}), this.bem("Padding"))}
                x={design.getIn(["foregroundImage", "position", "x"])}
                y={design.getIn(["foregroundImage", "position", "y"])}
                scale={design.getIn(["foregroundImage", "scale", "value"])}
                style={{
                    top:"50%",
                }}
                handleChange={({x, y}) => {
                    if (!EditorOptionsActions)
                        return

                    EditorOptionsActions.update({
                        design: design
                            .setIn(["foregroundImage", "position", "x"], x)
                            .setIn(["foregroundImage", "position", "y"], y)
                    })
                }}
            >
                <img
                    className={this.bem("Foreground")}
                    src={`${Config.API_ROOT_HTTP}${design.getIn(["foregroundImage", "src"])}`}
                    draggable="false"
                    style={{
                        maskImage: blurMask,
                        WebkitMaskImage: blurMask,
                    }}
                />
            </DraggableBox>
        )
    }

    renderBookTitle() {
        const {design, width, height, scale, draggableId, onClick, EditorOptionsActions} = this.props
        const active = draggableId == "title"
        return design.getIn(["bookTitle", "text"])
            ? (
                <DraggableBox
                    active={active}
                    className={classNames(this.bem("DraggableBox", {active, text:true}), this.bem("Padding"))}
                    x={design.getIn(["bookTitle", "position", "x"])}
                    y={design.getIn(["bookTitle", "position", "y"])}
                    handleChange={({x, y}) => {
                        if (!EditorOptionsActions)
                            return
                        console.log("x, y: ", x, y)
                        EditorOptionsActions.update({
                            design: design
                                .setIn(["bookTitle", "position", "x"], x)
                                .setIn(["bookTitle", "position", "y"], y)
                        })
                    }}
                    style={{
                        order: design.getIn(["bookTitle", "position", "order"]),
                    }}
                >
                    <DesignText
                        draggable={draggableId == "title"}
                        className={this.bem("BookTitle")}
                        onChangeFontSize={nextFontSize => {
                            if (!EditorOptionsActions)
                                return

                            if (design.getIn(["bookTitle", "fontSize", "type"]) != "auto")
                                return

                            const value = Math.round(nextFontSize/scale)
                            const valueMin = value * 1/2
                            const valueMax = value * 3/2
                            EditorOptionsActions.update({
                                design: design
                                    .setIn(["bookTitle", "fontSize", "auto"], value)
                                    .setIn(["bookTitle", "fontSize", "autoMin"], valueMin)
                                    .setIn(["bookTitle", "fontSize", "autoMax"], valueMax)
                                    .toJS()
                            })
                        }}
                        font={design.getIn(["bookTitle", "font"])}
                        options={{
                            minSize: design.getIn(["bookTitle", "fontSize", "min"]) * scale,
                            maxSize: design.getIn(["bookTitle", "fontSize", "max"]) * scale,
                        }}
                        boxStyle={{
                            fontFamily: design.getIn(["bookTitle", "font", "name"]),
                            textAlign: design.getIn(["bookTitle", "textAlign", "value"]),
                        }}
                        textStyle={{
                            color: design.getIn(["bookTitle", "color"]),
                            fontSize: design.getIn(["bookTitle", "fontSize", "type"]) != "auto" ? (design.getIn(["bookTitle", "fontSize", "value"]) * scale) : null,
                            letterSpacing: design.getIn(["bookTitle", "textLetterSpace", "value"]) * scale,
                            textShadow: design.getIn(["bookTitle", "textShadow", "on"]) ? "rgb(0, 0, 0) 2px 2px 3px" : null,
                            textTransform: design.getIn(["bookTitle", "textLetterCase", "on"]) ? "uppercase" : null,
                        }}
                        letterSpacing={design.getIn(["bookTitle", "textLetterSpace", "value"])}
                        textTransform={design.getIn(["bookTitle", "textLetterCase", "on"])}
                    >
                        {design.getIn(["bookTitle", "text"])}
                    </DesignText>
                </DraggableBox>
            )
            : null
    }

    renderAuthorName() {
        const {design, width, height, scale, draggableId, onClick, EditorOptionsActions} = this.props
        const active = draggableId == "author"

        return design.getIn(["authorName", "text"])
            ? (
                <DraggableBox
                    active={active}
                    className={classNames(this.bem("DraggableBox", {active, text:true}), this.bem("Padding"))}
                    x={design.getIn(["authorName", "position", "x"])}
                    y={design.getIn(["authorName", "position", "y"])}
                    handleChange={({x, y}) => {
                        if (!EditorOptionsActions)
                            return

                        EditorOptionsActions.update({
                            design: design
                                .setIn(["authorName", "position", "x"], x)
                                .setIn(["authorName", "position", "y"], y)
                        })
                    }}
                    style={{
                        order: design.getIn(["authorName", "position", "order"]),
                    }}
                >
                    <DesignText
                        draggable={draggableId == "author"}
                        className={this.bem("AuthorName")}
                        onChangeFontSize={nextFontSize => {
                            if (!EditorOptionsActions)
                                return

                            if (design.getIn(["authorName", "fontSize", "type"]) != "auto")
                                return

                            const value = Math.round(nextFontSize/scale)
                            const valueMin = value * 1/2
                            const valueMax = value * 3/2
                            EditorOptionsActions.update({
                                design: design
                                    .setIn(["authorName", "fontSize", "auto"], value)
                                    .setIn(["authorName", "fontSize", "autoMin"], valueMin)
                                    .setIn(["authorName", "fontSize", "autoMax"], valueMax)
                                    .toJS()
                            })
                        }}
                        font={design.getIn(["authorName", "font"])}
                        options={{
                            minSize: design.getIn(["authorName", "fontSize", "min"]) * scale,
                            maxSize: design.getIn(["authorName", "fontSize", "max"]) * scale,
                        }}
                        boxStyle={{
                            fontFamily: design.getIn(["authorName", "font", "name"]),
                            textAlign: design.getIn(["authorName", "textAlign", "value"]),
                        }}
                        textStyle={{
                            color: design.getIn(["authorName", "color"]),
                            fontSize: design.getIn(["authorName", "fontSize", "type"]) != "auto" ? (design.getIn(["authorName", "fontSize", "value"]) * scale) : null,
                            letterSpacing: design.getIn(["authorName", "textLetterSpace", "value"]) * scale,
                            textShadow: design.getIn(["authorName", "textShadow", "on"]) ? "rgb(0, 0, 0) 2px 2px 3px" : null,
                            textTransform: design.getIn(["authorName", "textLetterCase", "on"]) ? "uppercase" : null,
                        }}
                        letterSpacing={design.getIn(["authorName", "textLetterSpace", "value"])}
                        textTransform={design.getIn(["authorName", "textLetterCase", "on"])}
                    >
                        {design.getIn(["authorName", "text"])}
                    </DesignText>
                </DraggableBox>
            )
            : null
    }

    renderSubTitle() {
        const {design, width, height, scale, draggableId, onClick, EditorOptionsActions} = this.props
        const active = draggableId == "subtitle"

        return design.getIn(["subTitle", "text"])
            ? (
                <DraggableBox
                    active={active}
                    className={classNames(this.bem("DraggableBox", {active, text:true}), this.bem("Padding"))}
                    x={design.getIn(["subTitle", "position", "x"])}
                    y={design.getIn(["subTitle", "position", "y"])}
                    handleChange={({x, y}) => {
                        if (!EditorOptionsActions)
                            return

                        EditorOptionsActions.update({
                            design: design
                                .setIn(["subTitle", "position", "x"], x)
                                .setIn(["subTitle", "position", "y"], y)
                        })
                    }}
                    style={{
                        order: design.getIn(["subTitle", "position", "order"]),
                        position: design.getIn(["subTitle", "position", "position"]),
                    }}
                >
                    <DesignText
                        draggable={draggableId == "subtitle"}
                        className={this.bem("SubTitle")}
                        onChangeFontSize={nextFontSize => {
                            if (!EditorOptionsActions)
                                return

                            if (design.getIn(["subTitle", "fontSize", "type"]) != "auto")
                                return

                            const value = Math.round(nextFontSize/scale)
                            const valueMin = value * 1/2
                            const valueMax = value * 3/2
                            EditorOptionsActions.update({
                                design: design
                                    .setIn(["subTitle", "fontSize", "auto"], value)
                                    .setIn(["subTitle", "fontSize", "autoMin"], valueMin)
                                    .setIn(["subTitle", "fontSize", "autoMax"], valueMax)
                                    .toJS()
                            })
                        }}
                        font={design.getIn(["subTitle", "font"])}
                        options={{
                            minSize: design.getIn(["subTitle", "fontSize", "min"]) * scale,
                            maxSize: design.getIn(["subTitle", "fontSize", "max"]) * scale,
                        }}
                        boxStyle={{
                            fontFamily: design.getIn(["subTitle", "font", "name"]),
                            textAlign: design.getIn(["subTitle", "textAlign", "value"]),
                        }}
                        textStyle={{
                            color: design.getIn(["subTitle", "color"]),
                            fontSize: design.getIn(["subTitle", "fontSize", "type"]) != "auto" ? (design.getIn(["subTitle", "fontSize", "value"]) * scale) : null,
                            letterSpacing: design.getIn(["subTitle", "textLetterSpace", "value"]) * scale,
                            textShadow: design.getIn(["subTitle", "textShadow", "on"]) ? "rgb(0, 0, 0) 2px 2px 3px" : null,
                            textTransform: design.getIn(["subTitle", "textLetterCase", "on"]) ? "uppercase" : null,
                        }}
                        letterSpacing={design.getIn(["subTitle", "textLetterSpace", "value"])}
                        textTransform={design.getIn(["subTitle", "textLetterCase", "on"])}
                    >
                        {design.getIn(["subTitle", "text"])}
                    </DesignText>
                </DraggableBox>
            )
            : null
    }

    renderHoverEffect() {
        const { hoverEffect } = this.props
        let { hoverText } = this.props
        if (!hoverEffect)
            return null
        
        hoverText = hoverText || "choose"
        return (
            <div className={this.bem("Hover")}>
                <div className={this.bem("Hover-Inner")}>
                    {hoverText}
                </div>
            </div>
        )
    }

    render () {
        const {design, width, height, scale, draggableId, onClick, EditorOptionsActions, noShadow, currentRef, hoverEffect} = this.props
        const bookTitleFontSlug = design.getIn(["bookTitle", "font", "slug"])
        const authorNameFontSlug = design.getIn(["authorName", "font", "slug"])
        const justifyContent = getBoxJustifyContentByLocations(
            design.getIn(["bookTitle", "position"]),
            design.getIn(["authorName", "position"]),
        )

        const designSrc = design.getIn(["backgroundImage", "src"])
        console.log(designSrc);
        const isBase64 = designSrc && designSrc.includes('base64')

        return (
            <FontLoader fonts2load={[bookTitleFontSlug, authorNameFontSlug]}>
                <div
                    ref={currentRef}
                    className={this.bem({noShadow, justifyContent, hoverEffect})}
                    onClick={onClick}
                    style={{
                        width,
                        height,
                        padding: 50 * scale,
                    }}
                >
                    <img className={this.bem("Background")} src={`${isBase64 ? '' : Config.API_ROOT_HTTP}${designSrc}`}/>
                    {this.renderForeground()}
                    {this.renderBookTitle()}
                    {this.renderAuthorName()}
                    {this.renderSubTitle()}
                    {this.renderHoverEffect()}
                </div>
            </FontLoader>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({}),
)(Design)
