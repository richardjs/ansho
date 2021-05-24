import * as Lexer from './lexer.js';
import * as Model from './model.js';
import {SAMPLE_1, SAMPLE_2} from './sample.js';


const e = React.createElement;


class Token extends React.Component {
    render() {
        let className = 'hit';
        if (this.props.response == 0) {
            className = 'miss';
        }

        return e('span',
            {className: 'token'},
            e('span', {
                className: className,
            }, this.props.token.string),
            e('span', null, this.props.token.suffix),
        );
    }
}


class Segment extends React.Component {
    render() {
        if (this.props.startVisible) {
            const tokens = this.props.segment.tokens.map(token => {
                return e(Token, {
                    token: token,
                    response: 1,
                }, null);
            });

            return e('span',
                {className: 'segment'},
                ...tokens,
            );
        }

        const visible = [];
        let i;
        for (i = 0; i < this.props.responses.length; i++) {
            visible.push(e(Token, {
                token: this.props.segment.tokens[i],
                response: this.props.responses[i],
            }, null));
        }

        return e('span',
            {className: 'segment'},
            ...visible,
        );
    }
}


class Reviewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            responses: [],
        }

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    render() {
        const segments = [];
        for (let offset = -3; offset < 0; offset ++) {
            const segment = this.segment(offset);
            if (segment === undefined) {
                continue;
            }
            segments.push(e(Segment, {
                segment: segment,
                startVisible: true,
                key: this.props.segmentIndex + offset,
            }, null));
        }
        segments.push(
            e(Segment, {
                segment: this.segment(),
                responses: this.state.responses,
                key: this.props.segmentIndex,
            }, null),
        );
        return segments;
    }

    segment(offset) {
        if (offset === undefined) offset = 0;
        return this.props.model.segments[this.props.segmentIndex + offset];
    }

    nextToken() {
        if (this.state.responses.length === this.segment().tokens.length) {
            const responses = [...this.state.responses];
            this.setState({responses: []});
            this.props.onSegmentResponses(responses)
            return;
        }

        this.setState({
            responses: this.state.responses.concat(1),
        });
    }

    miss() {
        if (this.state.responses.slice(-1) == 1) {
            this.setState({
                responses: this.state.responses.slice(0, -1).concat(0),
            });
        } else {
            this.setState({
                responses: this.state.responses.slice(0, -1),
            });
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowRight':
                this.nextToken();
                break;
            case 'ArrowLeft':
                this.miss();
                break;
        }
    }
}


const model = Lexer.parse(SAMPLE_2);
class App extends React.Component {
    constructor(props) {
        super(props);
        window.app = this;

        this.state = {
            model: model,
            segmentIndex: Model.nextSegmentIndex(model),
        };

        this.handleSegmentResponses = this.handleSegmentResponses.bind(this);
    }

    render() {
        return e(Reviewer, {
            model: model,
            segmentIndex: this.state.segmentIndex,
            onSegmentResponses: this.handleSegmentResponses,
        }, null, null);
    }

    handleSegmentResponses(responses) {
        const model = Model.clone(this.state.model);
        for (let i = 0; i < responses.length; i++) {
            const token = model.segments[this.state.segmentIndex].tokens[i];
            token.hits += responses[i];
            token.visits++;
        }

        this.setState({
            model: model,
            segmentIndex: Model.nextSegmentIndex(model),
        });
    }
}


ReactDOM.render(
    e(App, null, null),
    document.getElementById('root')
);
