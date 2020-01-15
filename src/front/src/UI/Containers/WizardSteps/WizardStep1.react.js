import './WizardStep1.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'
import User from 'UI/Containers/User/User.react'

// import SignupModal from 'UI/Containers/SignupModal/SignupModal.react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import SubTitle from 'UI/Components/SubTitle/SubTitle.react'
import Center from 'UI/Components/Center/Center.react'
import Input from 'UI/Components/Input/Input.react'
import Footer from 'UI/Components/Footer/Footer.react'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions'

class WizardStep1 extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'WizardStep1'
        this.bem = bem.with(this.blockName)

        const {bookTitleText, authorNameText} = props.bookCover.toJS()
        this.state = {
            bookTitleText,
            authorNameText,
        }
    }

    handleBookTitleChange(bookTitleText) {
        this.setState({
            bookTitleText,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                bookTitleText,
                updated: true,
            })
        })
    }

    handleAuthorNameChange(authorNameText) {
        this.setState({
            authorNameText,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                authorNameText,
                updated: true,
            })
        })
    }

    handleNextStep() {
        this.props.history.push("/wizard/2")
    }

    render () {
        const {bookTitleText, authorNameText} = this.state
        let activeNext = true

        return (
            <article className={this.bem()}>
                <User>
                    {user => (
                        <span>
                        <Header/>
                        <Center>
                            <Title>Make a beautiful book cover fast and easy</Title>
                            <SubTitle>With the help of our AI-powered system you can instantly create a cover design for your book</SubTitle>
                            <Input
                                value={bookTitleText}
                                placeholder="Enter your book title"
                                onChange={::this.handleBookTitleChange}
                                acceptableValue={bookTitleText.length > 0}
                                groupStyle={{
                                    margin: "40px 0 0 0",
                                }}
                            />
                            <Input
                                value={authorNameText}
                                placeholder="Enter author's name"
                                onChange={::this.handleAuthorNameChange}
                                acceptableValue={authorNameText.length > 0}
                                groupStyle={{
                                    margin: "40px 0 0 0",
                                }}
                            />
                        </Center>
                        <Footer
                            hasNext={true}
                            activeNext={activeNext}

                            onNextClick={::this.handleNextStep}
                        /></span>
                    )}
                </User>
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
)(WizardStep1)
