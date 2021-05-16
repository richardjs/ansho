const SEGMENT_DELIMITERS = ',.?!—";\n';
const TOKEN_DELIMITERS = SEGMENT_DELIMITERS + ' ';

// We could definitely improve the efficiency of these operations; right
// now the same characters are checked multiple times.

export class Token {
    constructor(text) {
        this.string = '';
        this.suffix = '';
        for (const c of text) {
            if (TOKEN_DELIMITERS.includes(c)) {
                this.suffix += c;
            } else {
                this.string += c;
            }
        }
    }
}


export class Segment {
    constructor(text) {
        this.tokens = [];
        
        let tokenText = '';
        let inDelimiter = false;
        for (const c of text) {
            if (TOKEN_DELIMITERS.includes(c)) {
                inDelimiter = true; 
            } else if (inDelimiter) {
                this.tokens.push(new Token(tokenText));
                tokenText = '';
                inDelimiter = false;
            }

            tokenText += c;
        }

        this.tokens.push(new Token(tokenText));
    }
}


export class AnshoText {
    constructor() {
        this.segments = []
    }

    static parse(raw) {
        const text = new AnshoText();

        let segmentText = '';
        let inDelimiter = false;
        for (const c of raw) {
            if (SEGMENT_DELIMITERS.includes(c)) {
               inDelimiter = true;
            } else if (inDelimiter && !TOKEN_DELIMITERS.includes(c)) {
                text.segments.push(new Segment(segmentText));
                segmentText = '';
                inDelimiter = false;
            }
            segmentText += c;
        }

        text.segments.push(new Segment(segmentText));
        return text;
    }

    static load(json) {
    }

    toJSON() {
        const json = {"segments": []}
        for (const segment of this.segments) {
            const segmentJSON = [];
            for (const token of segment.tokens) {
                segmentJSON.push({
                    "string": token.string,
                    "suffix": token.suffix,
                })
            }
            json.segments.push(segmentJSON);
        }

        return JSON.stringify(json);
    }
}
