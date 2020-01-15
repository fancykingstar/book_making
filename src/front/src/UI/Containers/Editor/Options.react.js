import './Options.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'
import I from 'immutable'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import TEXT_FONTS_ALL from 'Consts/TEXT_FONTS_ALL.const'

import Designs from 'UI/Containers/Designs/Designs.react'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'
import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'

class Options extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Options'
        this.bem = bem.with(this.blockName)

        this.state = {
            limit: 14,
            shouldUpdate: true,
        }

        this.refRoot = React.createRef()

        this.handleScroll = () => this._handleScroll()
    }

    _handleScroll() {
        if ((this.refRoot.current.offsetHeight + this.refRoot.current.scrollTop) >= (this.refRoot.current.scrollHeight - 500)) {
            console.log("_handleScroll")
            this.handleIncreaseLimit()
            this.removeScrollListener()
            setTimeout(() => {
                if (this.unmounted)
                    return
                this.addScrollListener()
            }, 2000)
        }
    }

    componentDidMount() {
        this.setState({
            shouldUpdate: false,
        })
    }

    componentDidUpdate({ editorOptions:prevEditorOptions }) {
        const {editorOptions} = this.props
        this.prevEditorOptions = prevEditorOptions
        if (
            editorOptions.getIn(["instrument", "slug"]) != prevEditorOptions.getIn(["instrument", "slug"]) ||
            editorOptions.get("design") != prevEditorOptions.get("design")
        ) {
            this.setState({
                limit: 14,
                shouldUpdate: true,
            })
        } else if(this.state.shouldUpdate) {
            this.setState({
                shouldUpdate: false,
            })
        }
    
        this.addScrollListener()
    }

    componentWillUnmount() {
        this.unmounted = true
        this.removeScrollListener()
    }

    addScrollListener() {
        this.refRoot.current.addEventListener("scroll", this.handleScroll)
    }

    removeScrollListener() {
        this.refRoot.current.removeEventListener("scroll", this.handleScroll)
    }

    handleIncreaseLimit() {
        this.setState(prevState => ({
            limit: prevState.limit + 14,
        }))
    }

    handleChangeForeground(nextDesign) {
        const nextForeground = nextDesign.get("foregroundImage")
        const {editorOptions} = this.props
        const design = editorOptions.get("design").update("foregroundImage", b => nextForeground)
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleChangeBackground(nextDesign) {
        const nextBackground = nextDesign.get("backgroundImage")
        const {editorOptions} = this.props
        const design = editorOptions.get("design").update("backgroundImage", b => nextBackground)
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleChangeTitleFont(nextDesign) {
        const nextBookFont = nextDesign.getIn(["bookTitle", "font"])
        const {editorOptions} = this.props
        const design = editorOptions.get("design").updateIn(["bookTitle", "font"], b => nextBookFont)
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleChangeAuthorFont(nextDesign) {
        const nextAuthorNameFont = nextDesign.getIn(["authorName", "font"])
        const {editorOptions} = this.props
        const design = editorOptions.get("design").updateIn(["authorName", "font"], b => nextAuthorNameFont)
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    handleChangeSubTitleFont(nextDesign) {
        const nextSubtitleNameFont = nextDesign.getIn(["subTitle", "font"])
        const {editorOptions} = this.props
        const design = editorOptions.get("design").updateIn(["subTitle", "font"], b => nextSubtitleNameFont)
        this.props.EditorOptionsActions.update({
            design,
        })
    }

    renderSwitcher() {
        const {editorOptions, bookCover} = this.props
        const {limit, shouldUpdate} = this.state

        if (editorOptions.getIn(["instrument", "slug"]) == "background") {
            return (
                <Designs
                    hoverEffect

                    className={this.bem("Designs")}

                    limit={limit}
                    width={150}
                    height={230}
                    scale={.32}
                    shouldUpdate={shouldUpdate}
                    onClick={::this.handleChangeBackground}
                    foregroundImages={editorOptions.getIn(["design", "foregroundImage"])}
                    backgroundImages={bookCover.get("backgroundImageAlternatives")}

                    bookTitleColor={editorOptions.getIn(["design", "bookTitle", "color"])}
                    authorNameColor={editorOptions.getIn(["design", "authorName", "color"])}
                    subTitleColor={editorOptions.getIn(["design", "subTitle", "color"])}

                    bookTitle={editorOptions.getIn(["design", "bookTitle"])}
                    authorName={editorOptions.getIn(["design", "authorName"])}
                    subTitle={editorOptions.getIn(["design", "subTitle"])}

                    bookTitleText={editorOptions.getIn(["design", "bookTitle", "text"])}
                    authorNameText={editorOptions.getIn(["design", "authorName", "text"])}
                    subTitleText={editorOptions.getIn(["design", "subTitle", "text"])}

                    bookTitlePosition={editorOptions.getIn(["design", "bookTitle", "position"])}
                    authorNamePosition={editorOptions.getIn(["design", "authorName", "position"])}
                    subTitlePosition={editorOptions.getIn(["design", "subTitle", "position"])}

                    bookGenre={editorOptions.getIn(["design", "bookGenre"])}

                    bookTitleFonts={editorOptions.getIn(["design", "bookTitle", "font"])}
                    authorNameFonts={editorOptions.getIn(["design", "authorName", "font"])}
                    subTitleFonts={editorOptions.getIn(["design", "subTitle", "font"])}

                    noShuffle
                >
                    <button
                        className={this.bem("More-Button")}
                        onClick={::this.handleIncreaseLimit}
                    >
                        More
                    </button>
                </Designs>
            )
        }

        if (editorOptions.getIn(["instrument", "slug"]) == "foreground") {
            return (
                <Designs
                    hoverEffect

                    className={this.bem("Designs")}

                    limit={limit}
                    width={150}
                    height={230}
                    scale={.32}
                    shouldUpdate={shouldUpdate}
                    onClick={::this.handleChangeForeground}
                    foregroundImages={bookCover.get("foregroundImageAlternatives")}
                    backgroundImages={editorOptions.getIn(["design", "backgroundImage"])}

                    bookTitleColor={editorOptions.getIn(["design", "bookTitle", "color"])}
                    authorNameColor={editorOptions.getIn(["design", "authorName", "color"])}
                    subTitleColor={editorOptions.getIn(["design", "subTitle", "color"])}

                    bookTitle={editorOptions.getIn(["design", "bookTitle"])}
                    authorName={editorOptions.getIn(["design", "authorName"])}
                    subTitle={editorOptions.getIn(["design", "subTitle"])}

                    bookTitleText={editorOptions.getIn(["design", "bookTitle", "text"])}
                    authorNameText={editorOptions.getIn(["design", "authorName", "text"])}
                    subTitleText={editorOptions.getIn(["design", "subTitle", "text"])}

                    bookTitlePosition={editorOptions.getIn(["design", "bookTitle", "position"])}
                    authorNamePosition={editorOptions.getIn(["design", "authorName", "position"])}
                    subTitlePosition={editorOptions.getIn(["design", "subTitle", "position"])}

                    bookGenre={editorOptions.getIn(["design", "bookGenre"])}

                    bookTitleFonts={editorOptions.getIn(["design", "bookTitle", "font"])}
                    authorNameFonts={editorOptions.getIn(["design", "authorName", "font"])}
                    subTitleFonts={editorOptions.getIn(["design", "subTitle", "font"])}

                    noShuffle
                >
                    <button
                        className={this.bem("More-Button")}
                        onClick={::this.handleIncreaseLimit}
                    >
                        More
                    </button>
                </Designs>
            )
        }

        if (editorOptions.getIn(["instrument", "slug"]) == "title") {
            return (
                <Designs
                    hoverEffect

                    className={this.bem("Designs")}

                    limit={limit}
                    width={150}
                    height={230}
                    scale={.32}
                    shouldUpdate={shouldUpdate}
                    onClick={::this.handleChangeTitleFont}
                    foregroundImages={editorOptions.getIn(["design", "foregroundImage"])}
                    backgroundImages={editorOptions.getIn(["design", "backgroundImage"])}

                    bookTitleColor={editorOptions.getIn(["design", "bookTitle", "color"])}
                    authorNameColor={editorOptions.getIn(["design", "authorName", "color"])}
                    subTitleColor={editorOptions.getIn(["design", "subTitle", "color"])}

                    bookTitle={editorOptions.getIn(["design", "bookTitle"])}
                    authorName={editorOptions.getIn(["design", "authorName"])}
                    subTitle={editorOptions.getIn(["design", "subTitle"])}

                    bookTitleText={editorOptions.getIn(["design", "bookTitle", "text"])}
                    authorNameText={editorOptions.getIn(["design", "authorName", "text"])}
                    subTitleText={editorOptions.getIn(["design", "subTitle", "text"])}

                    bookTitlePosition={editorOptions.getIn(["design", "bookTitle", "position"])}
                    authorNamePosition={editorOptions.getIn(["design", "authorName", "position"])}
                    subTitlePosition={editorOptions.getIn(["design", "subTitle", "position"])}

                    bookGenre={editorOptions.getIn(["design", "bookGenre"])}

                    bookTitleFonts={TEXT_FONTS_ALL}
                    authorNameFonts={editorOptions.getIn(["design", "authorName", "font"])}
                    subTitleFonts={editorOptions.getIn(["design", "subTitle", "font"])}

                    noShuffle
                >
                    <button
                        className={this.bem("More-Button")}
                        onClick={::this.handleIncreaseLimit}
                    >
                        More
                    </button>
                </Designs>
            )
        }

        if (editorOptions.getIn(["instrument", "slug"]) == "author") {
            return (
                <Designs
                    hoverEffect

                    className={this.bem("Designs")}

                    limit={limit}
                    width={150}
                    height={230}
                    scale={.32}
                    shouldUpdate={shouldUpdate}
                    onClick={::this.handleChangeAuthorFont}
                    foregroundImages={editorOptions.getIn(["design", "foregroundImage"])}
                    backgroundImages={editorOptions.getIn(["design", "backgroundImage"])}

                    bookTitleColor={editorOptions.getIn(["design", "bookTitle", "color"])}
                    authorNameColor={editorOptions.getIn(["design", "authorName", "color"])}
                    subTitleColor={editorOptions.getIn(["design", "subTitle", "color"])}

                    bookTitle={editorOptions.getIn(["design", "bookTitle"])}
                    authorName={editorOptions.getIn(["design", "authorName"])}
                    subTitle={editorOptions.getIn(["design", "subTitle"])}

                    bookTitleText={editorOptions.getIn(["design", "bookTitle", "text"])}
                    authorNameText={editorOptions.getIn(["design", "authorName", "text"])}
                    subTitleText={editorOptions.getIn(["design", "subTitle", "text"])}

                    bookTitlePosition={editorOptions.getIn(["design", "bookTitle", "position"])}
                    authorNamePosition={editorOptions.getIn(["design", "authorName", "position"])}
                    subTitlePosition={editorOptions.getIn(["design", "subTitle", "position"])}

                    bookGenre={editorOptions.getIn(["design", "bookGenre"])}

                    bookTitleFonts={editorOptions.getIn(["design", "bookTitle", "font"])}
                    authorNameFonts={TEXT_FONTS_ALL}
                    subTitleFonts={editorOptions.getIn(["design", "subTitle", "font"])}

                    noShuffle
                >
                    <button
                        className={this.bem("More-Button")}
                        onClick={::this.handleIncreaseLimit}
                    >
                        More
                    </button>
                </Designs>
            )
        }

        if (editorOptions.getIn(["instrument", "slug"]) == "subtitle") {
            return (
                <Designs
                    hoverEffect

                    className={this.bem("Designs")}

                    limit={limit}
                    width={150}
                    height={230}
                    scale={.32}
                    shouldUpdate={shouldUpdate}
                    onClick={::this.handleChangeSubTitleFont}
                    foregroundImages={editorOptions.getIn(["design", "foregroundImage"])}
                    backgroundImages={editorOptions.getIn(["design", "backgroundImage"])}

                    bookTitleColor={editorOptions.getIn(["design", "bookTitle", "color"])}
                    authorNameColor={editorOptions.getIn(["design", "authorName", "color"])}
                    subTitleColor={editorOptions.getIn(["design", "subTitle", "color"])}

                    bookTitle={editorOptions.getIn(["design", "bookTitle"])}
                    authorName={editorOptions.getIn(["design", "authorName"])}
                    subTitle={editorOptions.getIn(["design", "subTitle"])}

                    bookTitleText={editorOptions.getIn(["design", "bookTitle", "text"])}
                    authorNameText={editorOptions.getIn(["design", "authorName", "text"])}
                    subTitleText={editorOptions.getIn(["design", "subTitle", "text"])}

                    bookTitlePosition={editorOptions.getIn(["design", "bookTitle", "position"])}
                    authorNamePosition={editorOptions.getIn(["design", "authorName", "position"])}
                    subTitlePosition={editorOptions.getIn(["design", "subTitle", "position"])}

                    bookGenre={editorOptions.getIn(["design", "bookGenre"])}

                    bookTitleFonts={editorOptions.getIn(["design", "bookTitle", "font"])}
                    authorNameFonts={editorOptions.getIn(["design", "authorName", "font"])}
                    subTitleFonts={TEXT_FONTS_ALL}

                    noShuffle
                >
                    <button
                        className={this.bem("More-Button")}
                        onClick={::this.handleIncreaseLimit}
                    >
                        More
                    </button>
                </Designs>
            )
        }

        return null
    }

    render () {
        const {className, editorOptions} = this.props
        return (
            <section
                ref={this.refRoot}
                className={classNames(this.bem(), className)}
            >
                {this.renderSwitcher()}
            </section>
        )
    }
}

export default connect(
    state => ({
        editorOptions: EditorOptionsSelector({state}),
        bookCover: BookCoverSelector({state}),
    }),
    dispatch => ({
        EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch),
    }),
)(Options)
