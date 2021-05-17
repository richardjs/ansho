const SEGMENT_DELIMITERS = ',.?!—";\n';
const TOKEN_DELIMITERS = SEGMENT_DELIMITERS + ' ';

// We could definitely improve the efficiency of these operations; right
// now the same characters are checked multiple times.

export class Token {
    constructor() {
        this.string = '';
        this.suffix = '';
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
                text.segments.push(Segment.parse(segmentText));
                segmentText = '';
                inDelimiter = false;
            }
            segmentText += c;
        }
        text.segments.push(Segment.parse(segmentText));

        return text;
    }
}
