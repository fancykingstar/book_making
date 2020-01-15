import {
    createSelector,
} from 'reselect'

const fonts = ({ state }) =>
    state.Fonts.get("fonts")

export default createSelector(
    [
        fonts,
    ],
    (
        fonts,
    ) => fonts,
)
