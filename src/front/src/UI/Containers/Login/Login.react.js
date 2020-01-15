import './Login.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Config from 'Config/Config'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import Center from 'UI/Components/Center/Center.react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Footer from 'UI/Components/Footer/Footer.react'
import SubTitle from 'UI/Components/SubTitle/SubTitle.react'
import {Link} from 'react-router-dom'

import * as UserActions from 'Redux/Actions/User/User.actions'

class Login extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Login'
        this.bem = bem.with(this.blockName)

        this.state = {
            errorMessage: "",
            onToggle: null,
        }

        this.refForm = React.createRef()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleSubmit(event) {
        const form = this.refForm.current
        if (!form.checkValidity())
            return

        event.preventDefault()
        const formData = new FormData(form)
        formData.set("RememberMe", formData.get("RememberMe") == "on")

        fetch(`/account/LoginAsync`, {
            method: "POST",
            credentials: 'include',
            body: formData,
        }).then(response => {
            if (!response.ok)
                return this.setState({
                    errorMessage: "Oops, something went wrong, try again please",
                })

            response.json().then(user => {
                if (!user.IsAuthorized) {
                    this.setState({
                        errorMessage: "Wrong email address or password, please try again",
                    })
                    return
                }

                this.props.UserActions.update(user)

                if (!this.props.onAuth) {
                    const { successURL, backURL } = this.props.location.state;
                    this.props.history.push(successURL ? successURL : backURL);
                } else {
                    this.props.onAuth()
                }

                if (!this.unmounted) {
                    this.setState({
                        errorMessage: ''
                    });
                }
            })
        })
    }

    renderSignUpLink(text) {
        // If form in a modal, trigger toggle callback,
        // otherwise place traditional link

        if (!this.props.onToggle) {
            return (
                <Link
                    className={this.bem("SignUpLink")}
                    to={{
                        pathname: "/signup",
                        state: {
                            backURL: this.props.location.state && this.props.location.state.backURL || this.props.location.pathname
                        }
                    }}>
                        {text}
                    </Link>
            )
        } else {
            return (
                <a href="#" onClick={this.props.onToggle}>
                    {text}
                </a>
            )
        }
    }

    render () {
        const {className, hideHeader} = this.props
        const {errorMessage} = this.state
        const {subTitleText, confirmButtonText} = this.props.location.state

        return (
            <article className={this.bem()} style={{ paddingTop: this.props.onAuth ? 0 : 175 }}>
                {!hideHeader && (
                    <Header isPrev onPrevClick={::this.handlePrevStep}/>
                )}
                <div className={this.bem("Container")}>
                    <Title>Sign In</Title>
                    {
                        subTitleText
                        ? <SubTitle>{subTitleText}</SubTitle>
                        : null
                    }
                    <Form ref={this.refForm} className={this.bem("Form")} onSubmit={::this.handleSubmit}>
                        {
                            !!errorMessage
                                ? <p className={this.bem("Error")}>{errorMessage}</p>
                                : null
                        }
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control className={this.bem("Input")} required name="Email" type="email" placeholder="Enter email" autoComplete="username email"/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control className={this.bem("Input")} required name="Password" type="password" placeholder="Password" autoComplete="current-password"/>
                        </Form.Group>
                        <Form.Group controlId="formBasicChecbox">
                            <Form.Check className={this.bem("Check")} name="RememberMe" type="checkbox" label="Remember me" />
                        </Form.Group>
                        <Button className={this.bem("Button")} variant="primary" type="submit">
                            {confirmButtonText ? confirmButtonText : "Sign In"}
                        </Button>
                    </Form>
                    <SubTitle className={this.bem("Footer")}>
                        <Link className={this.bem("ForgetPasswordLink")} to={"/account/forgotpassword"} target="_blank">Forgot password?</Link>
                        <span className={this.bem("Divider")}>/</span>
                        {this.renderSignUpLink('Sign Up')}
                    </SubTitle>
                </div>
            </article>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        UserActions: bindActionCreators(UserActions, dispatch),
    }),
)(Login)

