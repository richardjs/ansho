export function blankModel() {
    return {
        version: "0.1",
        name: '',
        segments: [
        ],
    }
}


export function blankSegment() {
    return {
        tokens: [],
    }
}


export function blankToken() {
    return {
        string: '',
        suffix: '',
        hits: 0,
        visits: 0,
    }
}


export function clone(model) {
    // Surely there's a more appropriate way to do this
    return JSON.parse(JSON.stringify(model));
}
