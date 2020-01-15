import { Component } from 'react'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Config from 'Config/Config'

import * as UserActions from 'Redux/Actions/User/User.actions'
import UserSelector from 'Redux/Selectors/User/User.selector'

class User extends Component {
    constructor (props) {
        super(props)
    }

    componentDidMount() {
        // this.props.UserActions.update({email: 'sf@deflamel.com', isAuthorized: true, canDownoad: true})
        // return

        fetch(`/account/info`).then(d => d.json().then(user => {
            this.props.UserActions.update(user)
        }))
    }

    render () {
        const {user, children} = this.props
        return children(user)
    }
}

export default connect(
    state => ({
        user: UserSelector({state}),
    }),
    dispatch => ({
        UserActions: bindActionCreators(UserActions, dispatch),
    }),
)(User)
