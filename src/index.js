import {AnshoText} from './lexer.js';
import {SAMPLE_TEXT} from './sample.js';


const e = React.createElement;


class Token extends React.Component {
    constructor(props) {
        super(props);

        this.token = props.token;
    }

    render() {
        return e('span',
            {className: 'token'},
            e('span', null, this.token.string),
            e('span', null, this.token.suffix),
        );
    }
}


class Segment extends React.Component {
    constructor(props) {
        super(props);

        this.segment = props.segment;
        this.tokens = props.segment.tokens.map((token, index) =>
            e(Token, {
                key: index,
                token: token,
            }, null)
        );
    }

    render() {
        return this.tokens;
    }
}


class TextLearner extends React.Component {
    constructor(props) {
        super(props);

        this.text = AnshoText.parse(SAMPLE_TEXT);
        this.segments = this.text.segments.map((segment, index) =>
            e(Segment, {
                key: index,
                segment: segment,
            }, null)
        );

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown() {
    }

    render() {
        return this.segments;
    }
}


class App extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return e('div', null, e(TextLearner, {text: SAMPLE_TEXT}, null));
    }
}


ReactDOM.render(
    e(App, null, null),
    document.getElementById('root')
);
