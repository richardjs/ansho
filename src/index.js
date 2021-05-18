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

        this.state = {
            mode: 'prompt',
            tokeni: 0,
        }
    }

    render() {
        const visible = [];
        for (let i = 0; i < this.state.tokeni; i++) {
            visible.push(e(Token, {token: this.props.segment.tokens[i]}, null));
        }
        return e('span',
            {className: 'segment'},
            ...visible,
            this.state.mode == 'prompt' ? '_____' : ''
        );
    }
}


class Reviewer extends React.Component {
    constructor(props) {
        super(props);

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
        return e(Segment, {'segment': this.props.text.nextSegment()}, null);
    }
}


class App extends React.Component {
    render() {
        return e('div', null, e(Reviewer, {text: this.props.text}, null));
    }
}


const text = AnshoText.parse(SAMPLE_TEXT)
ReactDOM.render(
    e(App, {text: text}, null),
    document.getElementById('root')
);
