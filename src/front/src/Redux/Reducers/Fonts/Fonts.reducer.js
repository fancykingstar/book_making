import I from 'immutable'

import {
    FONTS_UPDATE,
} from 'Redux/Actions/Fonts/Fonts.actions'

const DEFAULT_STATE = I.fromJS({})

export default function FontsReducer (state = DEFAULT_STATE, action) {
    switch (action.type) {

        case FONTS_UPDATE:
            return (nextState => nextState
                .update("fonts", (fonts = I.Map()) => fonts.mergeDeep(I.fromJS(action.fonts)))
            )(state)
            break

    }
    return state
}
