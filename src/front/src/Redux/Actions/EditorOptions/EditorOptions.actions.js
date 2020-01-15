export const EDITOR_OPTIONS_UPDATE = "EDITOR_OPTIONS_UPDATE"
export function update(editorOptions) {
    console.log("editorOptions:", editorOptions.toJS ? editorOptions.toJS() : editorOptions)
    return {
        type: EDITOR_OPTIONS_UPDATE,
        editorOptions,
    }
}
