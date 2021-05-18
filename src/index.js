import {AnshoText} from './lexer.js';
import {SAMPLE_TEXT} from './sample.js';


const e = React.createElement;


class Token extends React.Component {
    constructor(props) {
        super(props);

        this.token = props.token;
    }

    render() {
        let className = 'current';
        switch (this.props.response) {
            case 1:
                className = 'hit';
                break;
            case 0:
                className = 'miss';
                break;
        }

        return e('span',
            {className: 'token'},
            e('span', {
                className: className,
            }, this.token.string),
            e('span', null, this.token.suffix),
        );
    }
}


class Segment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const visible = [];
        let i;
        for (i = 0; i < this.props.responses.length; i++) {
            visible.push(e(Token, {
                token: this.props.segment.tokens[i],
                response: this.props.responses[i],
            }, null));
        }

        if (this.props.mode == 'prompt') {
            return e('span',
                {className: 'segment'},
                ...visible,
                '_____'
            );
        } else {
            return e('span',
                {className: 'segment'},
                ...visible,
                e(Token, {token: this.props.segment.tokens[i]}, null)
            );
        }
    }
}


class Reviewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'prompt',
            responses: [],
        }
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            switch (this.state.mode) {
                case 'prompt':
                    this.setState({mode: 'respond'});
                    break;
                case 'respond':
                    const response = e.key == 'ArrowRight' ? 1 : 0;
                    this.setState({
                        mode: 'prompt',
                        responses: this.state.responses.concat(response),
                    });
                    break;
            }
        }
    }

    render() {
        return e(Segment, {
            segment: this.props.text.nextSegment(),
            mode: this.state.mode,
            responses: this.state.responses,
        }, null);
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
