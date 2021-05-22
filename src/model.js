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
    return token.visits > 0 ? token.hits / token.vistis : -1;
}


function segmentScore(segment) {
    const tokenScores = segment.tokens.map(token => tokenScore(token));
    return Math.min(...tokenScores);
}


export function nextSegment(model) {
    let next = model.segments[0];
    let score = segmentScore(next);
    for (const segment of model.segments) {
        const s = segmentScore(segment);
        if (s < score) {
            next = segment;
            score = s;
        }
    }
    return next;
}


export function clone(model) {
    // Surely there's a more appropriate way to do this
    return JSON.parse(JSON.stringify(model));
}
