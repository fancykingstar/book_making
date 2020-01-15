import {
    createSelector,
} from 'reselect'

const user = ({ state }) =>
    state.User.get("user")

export default createSelector(
    [
        user,
    ],
    (
        user,
    ) => user,
)
