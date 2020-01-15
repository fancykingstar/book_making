import I from 'immutable'

import {
    USER_UPDATE,
} from 'Redux/Actions/User/User.actions'

const DEFAULT_STATE = I.fromJS({})

export default function UserReducer (state = DEFAULT_STATE, action) {
    switch (action.type) {

        case USER_UPDATE:
            return (nextState => nextState
                .update("user", (user = I.Map()) => user.mergeDeep(I.fromJS(action.user)))
            )(state)
            break

    }
    return state
}
