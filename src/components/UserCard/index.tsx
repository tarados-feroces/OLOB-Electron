import * as React from 'react';
import { block } from 'bem-cn';
import IconButton from '../../ui/IconButton';
import { Avatar } from '../../ui/Avatar';

import './index.scss';
import { Image } from 'semantic-ui-react';

interface OwnProps {}

interface ReduxProps {
    avatar?: string;
    login?: string;
    onLogOut?(): void;
    onOpenUserInfo?(data: object): void;
}

type UserCardProps = OwnProps & ReduxProps;

interface UserCardState {
    closed: boolean;
}

const b = block('olob-usercard');

export default class UserCard extends React.Component<UserCardProps, UserCardState> {
    public state = {
        closed: false
    };

    public render() {
        const { login, onLogOut, avatar } = this.props;
        const { closed } = this.state;

        return (
            <div className={b()}>
                <div className={b('content')} >
                    <div className={b('content-item')} >
                        <IconButton
                            size="s"
                            icon={closed ? 'arrow-left' : 'arrow-right'}
                            onClick={closed ? this.onOpenCard : this.onCloseCard}
                        />
                    </div>
                    {!closed &&
                        <div className={b('content-item')} >
                            <IconButton
                                size="m"
                                icon="edit"
                                onClick={this.handleProfileChange}
                            />
                        </div>
                    }
                    {!closed &&
                        <div className={b('content-item')} >
                            <p>{login}</p>
                        </div>
                    }
                    <div className={b('content-item')} >
                        <Avatar src={avatar} className={b('avatar')} />
                    </div>
                    {!closed &&
                        <div className={b('content-item')} >
                            <IconButton
                                size="xl"
                                icon="logout"
                                onClick={onLogOut}
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }

    private onCloseCard = () => {
        this.setState({ closed: true });
    }

    private onOpenCard = () => {
        this.setState({ closed: false });
    }

    private handleProfileChange = () => {
        this.props.onOpenUserInfo({});
    }
}
