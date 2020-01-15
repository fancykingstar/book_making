import './WizardStep5.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import STYLES from 'Consts/STYLES.const'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import SubTitle from 'UI/Components/SubTitle/SubTitle.react'
import Center from 'UI/Components/Center/Center.react'
import Styles from 'UI/Components/Styles/Styles.react'
import Footer from 'UI/Components/Footer/Footer.react'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import UserSelector from 'Redux/Selectors/User/User.selector'
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions'

class WizardStep5 extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'WizardStep5'
        this.bem = bem.with(this.blockName)

        const {selectedStyles} = props.bookCover.toJS()
        this.state = {
            selectedStyles,
            selectedStylesEnoughLength: 3,
            styles: STYLES.toJS().map(({id,slug}) => (
                {
                    id,
                    src: `/images/textures/${slug}.jpg`,
                }
            )),
        }
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleNextStep() {
        this.props.history.push("/wizard/6")
    }

    handleStyleSelect(style) {
        let {selectedStyles, selectedStylesEnoughLength} = this.state

        if (selectedStyles.some(s => s.id == style.id)) {
            selectedStyles = selectedStyles.filter(s => s.id != style.id)

        } else if (selectedStyles.length < selectedStylesEnoughLength) {
            selectedStyles.push(style)
        }

        this.setState({
            selectedStyles,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                selectedStyles: selectedStyles.length > 0 ? selectedStyles : [ {id: -1, src: "skipped"}],
                updated: true,
            })
        })
    }

    render () {
        const {styles, selectedStyles, selectedStylesEnoughLength} = this.state
        const hasEnoughSelected = selectedStyles.length == selectedStylesEnoughLength
        const hasSkip = !selectedStyles.length
        
        return (
            <article className={this.bem()}>
                <Header isPrev onPrevClick={::this.handlePrevStep}/>
                <Center>
                    <Title>Pick 3 images you like</Title>
                    <SubTitle>We will use them to stylize your personal design</SubTitle>
                    <Styles
                        styles={styles}
                        selectedStyles={selectedStyles}
                        maxSelected={hasEnoughSelected}
                        onSelect={::this.handleStyleSelect}
                    />
                </Center>
                <Footer
                    hasSkip={hasSkip}
                    activeSkip={true}

                    hasNext={!hasSkip}
                    activeNext={hasEnoughSelected}

                    onNextClick={::this.handleNextStep}
                />
            </article>
        )
    }
}

export default connect(
    state => ({
        user: UserSelector({state}),
        bookCover: BookCoverSelector({state}),
    }),
    dispatch => ({
        BookCoverActions: bindActionCreators(BookCoverActions, dispatch),
    }),
)(WizardStep5)
