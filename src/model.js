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


function totalModelVisits(model) {
    let totalVisits = 0;
    for (const segment of model.segments) {
        for (const token of segment.tokens) {
            totalVisits += token.visits;
        }
    }
    return totalVisits;
}


function tokenScore(token, totalVisits) {
    if (token.visits === 0) {
        return -1;
    }

    // TODO break out uctc
    let uctc = 2.0;
    return (token.hits / token.visits
        + uctc * Math.sqrt(Math.log(totalVisits) / token.visits));
}


function segmentScore(segment, totalVisits) {
    const tokenScores = segment.tokens.map(
        token => tokenScore(token, totalVisits));
    return Math.min(...tokenScores);
}


export function nextSegmentIndex(model) {
    let totalVisits = totalModelVisits(model);

    let next = 0;
    let score = segmentScore(model.segments[0], totalVisits);
    for (let i = 0; i < model.segments.length; i++) {
        const s = segmentScore(model.segments[i], totalVisits);
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
