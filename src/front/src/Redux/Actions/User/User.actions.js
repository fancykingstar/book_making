export const USER_UPDATE = "USER_UPDATE"
export function update(user) {
    return {
        type: USER_UPDATE,
        user,
    }
}
