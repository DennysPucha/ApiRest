export function setItem(key, value) {
    localStorage(key, value)
}

export function getItem(key) {
    return localStorage(key)
}

export function removeItem(key) {
    localStorage.removeItem(key)
}

export function clear() {
    localStorage.clear()
}

export function isSessionActive() {
    return localStorage.getItem("token") ? true : false
}