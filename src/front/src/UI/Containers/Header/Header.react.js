import './Header.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import Drawer from '@material-ui/core/Drawer'
import User from 'UI/Containers/User/User.react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'

class Header extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Header'
        this.bem = bem.with(this.blockName)

        this.state = {
            drawerOpen: false,
        }
    }

    renderBackButton() {
        const {isPrev, onPrevClick} = this.props
        if (isPrev)
            return (
                <div className={this.bem("BackButton")} onClick={onPrevClick}>
                    <div className={this.bem("BackButton-Arrow")}></div>
                </div>
            )
        return <div className={this.bem("BackButton", {fake:true})}/>
    }

    renderMenu() {
        return (
            <div
                className={this.bem("Menu")}
                onClick={() => this.setState({
                    drawerOpen: true,
                })}
            >
                <span className={this.bem("Menu-Item")}></span>
                <span className={this.bem("Menu-Item")}></span>
                <span className={this.bem("Menu-Item")}></span>
            </div>
        )
    }

    render () {
        const {className} = this.props
        return (
            <header className={classNames(this.bem(), className)}>
                {this.renderBackButton()}
                <a
                    className={this.bem("Logo")}
                    href="//deflamel.com/"
                    target="_self"
                />
                {this.renderMenu()}
                <Drawer
                    anchor="right"
                    open={this.state.drawerOpen}
                    onClose={() => this.setState({
                        drawerOpen: false,
                    })}
                >
                    <User>
                        {user => user && user.get("IsAuthorized")
                            ? (
                                <ul className={this.bem("Links")}>
                                    <li className={this.bem("User")}>{user.get("Email")}</li>
                                    <a className={this.bem("Link")} href="/">New Design</a>
                                    <Link className={this.bem("Link")} to={{pathname: "/saved"}}>Saved Designs</Link>
                                    <a className={this.bem("Link")} href="/manage/index" target="_blank">Account</a>
                                    <a className={this.bem("Link")} href="/account/logout">Sign Out</a>
                                </ul>
                            )
                            : (
                                <ul className={this.bem("Links")}>
                                    <Link className={this.bem("Link")} to={{pathname: "/login", state: { backURL: this.props.location.state && this.props.location.state.backURL || this.props.location.pathname }}}>Sign In</Link>
                                    <Link className={this.bem("Link")} to={{pathname: "/signup", state: { backURL: this.props.location.state && this.props.location.state.backURL || this.props.location.pathname }}}>Sign Up</Link>
                                </ul>
                            )
                        }
                    </User>
                </Drawer>
            </header>
        )
    }
}

export default withRouter(Header)
