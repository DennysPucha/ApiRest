export function setItem(key, value) {
    window.localStorage.setItem(key, value)
}

export function getItem(key) {
    return window.localStorage.getItem(key)
}

export function removeItem(key) {
    window.localStorage.removeItem(key)
}

export function clear() {
    window.localStorage.clear()
}

export function isSessionActive() {
    return window.localStorage.getItem("token") ? true : false
}