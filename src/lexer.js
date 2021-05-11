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


export function tokenize(text) {
    let segments = [];

    let segmentText = '';
    let inDelimiter = false;
    for (const c of text) {
        if (SEGMENT_DELIMITERS.includes(c)) {
           inDelimiter = true; 
        } else if (inDelimiter) {
            segments.push(new Segment(segmentText));
            segmentText = '';
            inDelimiter = false;
        }
        segmentText += c;
    }

    segments.push(new Segment(segmentText));

    return segments;
}


function _tokenize(text) {
    let segments = [];
    let tokens = [];

    let segment = [];
    let string = '';
    let suffix = '';
    for (const c of text) {
        if (TOKEN_DELIMITERS.includes(c)) {
            suffix += c;
            continue;
        }

        if (string.length && suffix.length) {
            segment.push(new Token(string, suffix));

            for (const d of suffix) {
                if (SEGMENT_DELIMITERS.includes(d)) {
                    segments.push(segment);
                    segment = [];
                    break;
                }
            }

            string = '';
            suffix = '';
        }

        string += c;
    }

    return segments;
}
