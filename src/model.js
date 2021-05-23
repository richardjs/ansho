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


function tokenScore(token) {
    return token.visits > 0 ? token.hits / token.visits : -1;
}


function segmentScore(segment) {
    const tokenScores = segment.tokens.map(token => tokenScore(token));
    return Math.min(...tokenScores);
}


export function nextSegmentIndex(model) {
    let next = 0;
    let score = segmentScore(model.segments[0]);
    for (let i = 0; i < model.segments.length; i++) {
        const s = segmentScore(model.segments[i]);
        if (s < score) {
            next = i;
            score = s;
        }
    }
    return next;
}


export function clone(model) {
    // Surely there's a more appropriate way to do this
    return JSON.parse(JSON.stringify(model));
}
