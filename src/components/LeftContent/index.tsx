import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { User } from '../../typings/UserTypings';
import { Button } from 'semantic-ui-react';
import UserCard from '../UserCard';
import WebSocketApi from '../../modules/WebSocketApi';
import { GameMessages } from '../../redux/constants/Game';

interface LeftContentProps {
    user: User;
    loading: boolean;
}

interface LeftContentState {
    loading: boolean;
}

const b = block('left-content');

export class LeftContent extends React.Component<LeftContentProps, LeftContentState> {
    public state = {
        loading: false
    };

    public componentDidUpdate(prevProps: Readonly<LeftContentProps>, prevState: Readonly<LeftContentState>) {
        if (this.props.loading !== prevState.loading) {
            this.setState({
                loading: this.props.loading
            });
        }
    }

    public render() {
        const { user } = this.props;

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <UserCard user={user} />
                </div>
                <div className={b('data')}>
                    <Button
                        onClick={this.sendSearchGameRequest}
                        size={'huge'}
                        className={b('play-button').toString()}
                        inverted={true}
                        fluid={false}
                        loading={this.state.loading}
                        disabled={this.state.loading}
                    >
                        Найти игру
                    </Button>
                </div>
            </div>
        );
    }

    public sendSearchGameRequest = (): void => {
        this.setState({ loading: true });
        WebSocketApi.sendMessage({}, GameMessages.SEARCH);
    }

}
