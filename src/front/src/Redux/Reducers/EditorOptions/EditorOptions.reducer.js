import I from 'immutable'

import {
    EDITOR_OPTIONS_UPDATE,
} from 'Redux/Actions/EditorOptions/EditorOptions.actions'

const DEFAULT_STATE = I.fromJS({})

export default function EditorOptionsReducer (state = DEFAULT_STATE, action) {
    switch (action.type) {

        case EDITOR_OPTIONS_UPDATE:
            return (nextState => nextState
                .update("editorOptions", (editorOptions = I.Map()) => editorOptions.mergeDeep(I.fromJS(action.editorOptions)))
            )(state)
            break

    }
    return state
}
