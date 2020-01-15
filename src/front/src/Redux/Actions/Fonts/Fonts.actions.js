export const FONTS_UPDATE = "FONTS_UPDATE"
export function update(fonts) {
    return {
        type: FONTS_UPDATE,
        fonts,
    }
}
