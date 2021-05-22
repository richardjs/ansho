import * as Model from './model.js';


const SEGMENT_DELIMITERS = ',.?!—";\n';
const TOKEN_DELIMITERS = SEGMENT_DELIMITERS + ' ';


export function parse(text) {
    const model = Model.blankModel();

    let segment = Model.blankSegment();
    let token = Model.blankToken();
    for (const c of text) {
        if (TOKEN_DELIMITERS.includes(c)) {
            token.suffix += c;
            continue;
        } else if (token.suffix && !TOKEN_DELIMITERS.includes(c)) {
            segment.tokens.push(token);
            for (const d of SEGMENT_DELIMITERS) {
                if (token.suffix.includes(d)) {
                    model.segments.push(segment);
                    segment = Model.blankSegment();
                    break;
                }
            }

            token = Model.blankToken();
        }

        token.string += c;
    }

    if (token.string) {
        segment.tokens.push(token);
    }
    if (segment.tokens.length) {
        model.segments.push(segment);
    }

    return model;
}


// We could definitely improve the efficiency of these operations; right
// now the same characters are checked multiple times.

export class Token {
    constructor() {
        this.string = '';
        this.suffix = '';

        this.hits = 0;
        this.visits = 0;
    }

    static parse(text) {
        const token = new Token();

        for (const c of text) {
            if (TOKEN_DELIMITERS.includes(c)) {
                token.suffix += c;
            } else {
                token.string += c;
            }
        }

        return token;
    }

    score() {
        return this.visits > 0 ? this.hits / this.visits : -1;
    }
}


export class Segment {
    constructor() {
        this.tokens = [];
    }
        
    static parse(text) {
        const segment = new Segment();

        let tokenText = '';
        let inDelimiter = false;
        for (const c of text) {
            if (TOKEN_DELIMITERS.includes(c)) {
                inDelimiter = true; 
            } else if (inDelimiter) {
                segment.tokens.push(Token.parse(tokenText));
                tokenText = '';
                inDelimiter = false;
            }

            tokenText += c;
        }
        segment.tokens.push(Token.parse(tokenText));

        return segment;
    }

    score() {
        const tokenScores = this.tokens.map(token => token.score());
        return Math.min(...tokenScores);
    }
}


export class AnshoText {
    constructor() {
        this.segments = []
    }

    nextSegment() {
        let next = this.segments[0];
        let score = next.score();
        for (const segment of this.segments) {
            if (segment.score() < score) {
                next = segment;
                score = next.score();
            }
        }
        return next;
    }

    static parse(raw) {
        const text = new AnshoText();

        let segmentText = '';
        let inDelimiter = false;
        for (const c of raw) {
            if (SEGMENT_DELIMITERS.includes(c)) {
               inDelimiter = true;
            } else if (inDelimiter && !TOKEN_DELIMITERS.includes(c)) {
                text.segments.push(Segment.parse(segmentText));
                segmentText = '';
                inDelimiter = false;
            }
            segmentText += c;
        }
        text.segments.push(Segment.parse(segmentText));

        return text;
    }

    static load(json) {
        const data = JSON.parse(json);
        const text = new AnshoText();

        for (const segmentData of data.segments) {
            const segment = new Segment();
            for (const tokenData of segmentData) {
                const token = new Token();
                token.string = tokenData.string;
                token.suffix = tokenData.suffix;
                segment.tokens.push(token);
            }
            text.segments.push(segment);
        }

        return text;
    }

    toJSON() {
        const data = {"segments": []}
        for (const segment of this.segments) {
            const segmentData = [];
            for (const token of segment.tokens) {
                segmentData.push({
                    "string": token.string,
                    "suffix": token.suffix,
                })
            }
            data.segments.push(segmentData);
        }

        return JSON.stringify(data);
    }
}
