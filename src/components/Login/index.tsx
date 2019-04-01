import * as React from 'react';
import { block } from 'bem-cn';
import { LoginData } from '../../modules/HttpApi';

import './index.scss';

import { Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import Form from '../../ui/Form';

interface OwnProps {}

interface ReduxProps {
    onLogin?(data: LoginData): void;
    isAuthorized?: boolean;
}

type LoginProps = OwnProps & ReduxProps;

interface LoginState {
    loading: boolean;
}

const b = block('olob-login');
const f = block('ui-form');

export default class Login extends React.Component<LoginProps, LoginState> {
    private loginRef = React.createRef<HTMLInputElement>();
    private passwordRef = React.createRef<HTMLInputElement>();

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            loading: false
        };
    }

    public render() {
        if (this.props.isAuthorized) {
            return (
                <Redirect to={PathConstants.AUTH} />
            );
        }

        return (
            <div className={b()}>
                <div className={b('title')}>
                    Добро пожаловать!
                </div>
                <div className={b('container').toString()}>
                    <Form>
                        <input className={f('item').toString()} placeholder={'Введите логин'} ref={this.loginRef} />
                        <input
                            placeholder={'Введите пароль'}
                            type={'password'}
                            ref={this.passwordRef}
                            className={f('item').toString()}
                        />
                        <Button
                            className={f('button').toString()}
                            type={'submit'}
                            inverted={true}
                            loading={this.state.loading}
                            onClick={this.onLogin}
                        >
                                Войти
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

    private onLogin = () => {
        this.props.onLogin({
            login: this.loginRef.current.value,
            password: this.passwordRef.current.value
        });

        this.setState({
            loading: true
        });
    }
}
