import './WizardStep2.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import BOOK_GENRE_OPTIONS_CONST from 'Consts/BOOK_GENRE_OPTIONS.const'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import SubTitle from 'UI/Components/SubTitle/SubTitle.react'
import Center from 'UI/Components/Center/Center.react'
import Textarea from 'UI/Components/Textarea/Textarea.react'
import Select from 'UI/Components/Select/Select.react'
import Footer from 'UI/Components/Footer/Footer.react'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions'

class WizardStep2 extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'WizardStep2'
        this.bem = bem.with(this.blockName)

        const {bookDescription, bookGenre} = props.bookCover.toJS()
        this.state = {
            bookDescription,
            bookGenre,

            bookGenreOptions: BOOK_GENRE_OPTIONS_CONST.sortBy(d => d.get("title")[0]).toJS(),
        }
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleNextStep() {
        this.props.history.push("/wizard/3")
    }

    handleBookDescriptionChange(bookDescription) {
        this.setState({
            bookDescription,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                bookDescription,
                updated: true,
            })
        })
    }

    handleBookGenreChange(bookGenre) {
        this.setState({
            bookGenre,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                bookGenre,
                updated: true,
            })
        })
    }

    render () {
        const {bookDescription, bookGenre} = this.state
        const activeNext = !!bookDescription && bookDescription.length > 50 && !!bookGenre
        return (
            <article className={this.bem()}>
                <Header isPrev onPrevClick={::this.handlePrevStep}/>
                <Center>
                    <Title>What is your book about?</Title>
                    <SubTitle>A well-written description will help us make the best cover design for you</SubTitle>
                    <Textarea
                        value={bookDescription}
                        placeholder="Give us a description of your book or enter keywords"
                        minSymbols={50}
                        maxSymbols={5000}
                        onChange={::this.handleBookDescriptionChange}
                        acceptableValue={bookDescription.length > 50}
                    />
                    <Select
                        className={this.bem("Select")}
                        options={this.state.bookGenreOptions}
                        selected={bookGenre}
                        placeholder="Select genre..."
                        onChange={::this.handleBookGenreChange}
                        acceptableValue={bookGenre ? bookGenre.title.length > 0 : false}
                    />
                </Center>
                <Footer
                    hasNext={true}
                    activeNext={activeNext}

                    onNextClick={::this.handleNextStep}
                />
            </article>
        )
    }
}

export default connect(
    state => ({
        bookCover: BookCoverSelector({state}),
    }),
    dispatch => ({
        BookCoverActions: bindActionCreators(BookCoverActions, dispatch),
    }),
)(WizardStep2)
