import * as React from 'react';
import { block } from 'bem-cn';
import { LoginData } from '../../modules/HttpApi';

import './index.scss';

import { Button, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import Form from '../../ui/Form';

interface OwnProps {
    history?: any;
}

interface ReduxProps {
    onLogin?(data: LoginData): void;
    isAuthorized?: boolean;
    error: boolean;
}

type LoginProps = OwnProps & ReduxProps;

interface LoginState {
    login: string;
    password: string;
    loading: boolean;
}

const b = block('olob-login');
const f = block('ui-form');

export default class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            loading: false,
            login: '',
            password: ''
        };
    }

    public componentDidUpdate(prevProps: Readonly<LoginProps>, prevState: Readonly<LoginState>) {
        if (prevState.loading !== this.state.loading) {
            setTimeout(() => {
                this.setState({
                    loading: false
                });
            }, 1000);
        }
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
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите логин'}
                            error={this.props.error}
                            onChange={this.changeLogin}
                        />
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите пароль'}
                            type={'password'}
                            error={this.props.error}
                            onChange={this.changePassword}
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
                        <Button
                            className={f('button').toString()}
                            inverted={true}
                            loading={this.state.loading}
                            onClick={this.goToSignup}
                        >
                            Регистрация
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

    private goToSignup = () => {
        this.props.history.push('/signup');
    }

    private changeLogin = (event) => {
        this.setState({
            login: event.target.value
        });
    }

    private changePassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    private onLogin = () => {
        this.props.onLogin({
            login: this.state.login,
            password: this.state.password
        });

        this.setState({
            loading: true
        });
    }
}
