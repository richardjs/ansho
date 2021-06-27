import * as Model from './model.js';


const SEGMENT_DELIMITERS = ',.?!—";\n';
const TOKEN_DELIMITERS = SEGMENT_DELIMITERS + ' ';


export function parse(text) {
    const model = new Model.Model();
    let segment = model._Segment();
    let token = model._Token();

    for (const c of text) {
        if (TOKEN_DELIMITERS.includes(c)) {
            token.suffix += c;
            continue;
        } else if (token.suffix && !TOKEN_DELIMITERS.includes(c)) {
            segment.tokens.push(token);
            for (const d of SEGMENT_DELIMITERS) {
                if (token.suffix.includes(d)) {
                    model.segments.push(segment);
                    segment = model._Segment();
                    break;
                }
            }

            token = model._Token();
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
