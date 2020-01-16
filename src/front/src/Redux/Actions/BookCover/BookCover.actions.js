export const BOOK_COVER_UPDATE = "BOOK_COVER_UPDATE"
export const BOOK_SAVE = "BOOK_SAVE"
export function update(bookCover) {
    return {
        type: BOOK_COVER_UPDATE,
        bookCover,
    }
}

export function save(bookCover) {
	return {
		type: BOOK_SAVE,
		bookCover
	}
}
