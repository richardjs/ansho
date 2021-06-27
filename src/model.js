export class Model {
    constructor() {
        this.version = "0.1";
        this.name = '';
        this.segments = [];
    }

    nextSegment() {
        let next = 0;
        let score = this._segmentScore(0);
        for (let i = 0; i < this.segments.length; i++) {
            const s = this._segmentScore(i);
            if (s < score) {
                next = i;
                score = s;
            }
        }
        return next;
    }

    clone() {
        // Surely there's a more appropriate way to do this
        return Object.assign(new Model(), JSON.parse(JSON.stringify(this)));
    }

    _Segment() {
        return {
            tokens: [],
        }
    }

    _Token() {
        return {
            string: '',
            suffix: '',
            hits: 0,
            visits: 0,
        }
    }

    _totalVisits() {
        let totalVisits = 0;
        for (const segment of this.segments) {
            for (const token of segment.tokens) {
                totalVisits += token.visits;
            }
        }
        return totalVisits;
    }

    _tokenScore(token) {
        if (token.visits === 0) {
            return -1;
        }

        // TODO break out uctc
        // TODO don't recalculate totalVisits
        let uctc = 2.0;
        return (token.hits / token.visits
            + uctc * Math.sqrt(Math.log(this._totalVisits()) / token.visits));
    }

    _segmentScore(i) {
        const tokenScores = this.segments[i].tokens.map(
            token => this._tokenScore(token));
        return Math.min(...tokenScores);
    }
}

window.Model = Model;
