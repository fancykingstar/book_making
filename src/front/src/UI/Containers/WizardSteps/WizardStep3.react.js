import './WizardStep3.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import SubTitle from 'UI/Components/SubTitle/SubTitle.react'
import Center from 'UI/Components/Center/Center.react'
import ImageUploader from 'UI/Components/ImageUploader/ImageUploader.react'
import Footer from 'UI/Components/Footer/Footer.react'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions'

class WizardStep3 extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'WizardStep3'
        this.bem = bem.with(this.blockName)

        const {foregroundImage, backgroundImage} = props.bookCover.toJS()
        this.state = {
            foregroundImage,
            backgroundImage,
        }
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleNextStep() {
        this.props.history.push("/wizard/4")
    }

    handleChangeForegroundImage(foregroundImage) {
        this.setState({
            foregroundImage,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                foregroundImage,
                updated: true,
            })
        })
    }

    handleChangeBackgroundImage(backgroundImage) {
        this.setState({
            backgroundImage,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                backgroundImage,
                updated: true,
            })
        })
    }

    render () {
        const isNext = true
        const {foregroundImage, backgroundImage} = this.state
        const hasSkip = !(foregroundImage || backgroundImage)

        return (
            <article className={this.bem()}>
                <Header isPrev onPrevClick={::this.handlePrevStep}/>
                <Center>
                    <Title>Add your images</Title>
                    <SubTitle>We can use them to craft your cover</SubTitle>
                    <div className={this.bem("ImagesBox")}>
                        <div className={this.bem("ImagesBox-Item")}>
                            <span className={this.bem("ImagesBox-Title")}>Foreground image</span>
                            <ImageUploader
                                name="foreground"
                                image={foregroundImage}
                                onChange={::this.handleChangeForegroundImage}
                                cropRatio={6/6}
                                baseWidth={240}
                                baseHeight={360}
                            />
                        </div>
                        <div className={this.bem("ImagesBox-Item")}>
                            <span className={this.bem("ImagesBox-Title")}>Background image</span>
                            <ImageUploader
                                name="background"
                                image={backgroundImage}
                                onChange={::this.handleChangeBackgroundImage}
                                cropRatio={6/9}
                                baseWidth={240}
                                baseHeight={360}
                            />
                        </div>
                    </div>
                </Center>
                <Footer
                    hasSkip={hasSkip}
                    activeSkip={true}

                    hasNext={!hasSkip}
                    activeNext={true}

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
)(WizardStep3)
