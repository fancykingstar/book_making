import I from 'immutable'

import {
    BOOK_COVER_UPDATE,
} from 'Redux/Actions/BookCover/BookCover.actions'

const DEFAULT_STATE = I.fromJS({})

export default function BookCoverReducer (state = DEFAULT_STATE, action) {
    switch (action.type) {

        case BOOK_COVER_UPDATE:
            return (nextState => nextState
                .update("bookCover", (bookCover = I.Map()) => { console.log('done'); return bookCover.mergeDeep(I.fromJS(action.bookCover)) })
            )(state)
            break

    }
    return state
}
