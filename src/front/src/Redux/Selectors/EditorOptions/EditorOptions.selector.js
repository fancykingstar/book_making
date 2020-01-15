import {
    createSelector,
} from 'reselect'

const editorOptions = ({ state }) =>
    state.EditorOptions.get("editorOptions")

export default createSelector(
    [
        editorOptions,
    ],
    (
        editorOptions,
    ) => editorOptions,
)
