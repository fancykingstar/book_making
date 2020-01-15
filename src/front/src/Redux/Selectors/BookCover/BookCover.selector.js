import {
    createSelector,
} from 'reselect'

const bookCover = ({ state }) =>
    state.BookCover.get("bookCover")

export default createSelector(
    [
        bookCover,
    ],
    (
        bookCover
    ) => bookCover,
)
