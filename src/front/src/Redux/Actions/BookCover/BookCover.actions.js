export const BOOK_COVER_UPDATE = "BOOK_COVER_UPDATE"
export function update(bookCover) {
    return {
        type: BOOK_COVER_UPDATE,
        bookCover,
    }
}
