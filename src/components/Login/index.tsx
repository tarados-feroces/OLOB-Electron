import * as React from 'react';
import { block } from 'bem-cn';
import { LoginData } from '../../modules/HttpApi';

import './index.scss';

import { Button, Input, Popup } from 'semantic-ui-react';
import { History } from 'history';
import * as PathConstants from '../../constants/PathsConstants';
import Form from '../../ui/Form';
import { NavLink } from 'react-router-dom';

interface OwnProps {
    history?: History;
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
    showError?: boolean;
}

const b = block('olob-login');
const f = block('ui-form');

export default class Login extends React.Component<LoginProps, LoginState> {
    private btnRef = React.createRef<HTMLDivElement>();
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            loading: false,
            login: '',
            password: '',
            showError: false
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

        if (this.props.error && prevState.loading !== this.state.loading && !prevState.showError) {
            this.setState({
                showError: true
            });
        }

        if (prevState.showError && !this.state.loading) {
            setTimeout(() => {
                this.setState({
                    showError: false
                });
            }, 2000);
        }
    }

    public render() {
        if (this.props.isAuthorized) {
            this.props.history.push(PathConstants.AUTH);
        }

        const errorStyle = {
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 'lighter',
            color: '#cc1600'
        };

        return (
            <div className={b()}>
                <div className={b('title')}>
                    Добро пожаловать!
                </div>
                <div className={b('container').toString()} ref={this.btnRef}>
                    <Popup
                        context={this.btnRef.current}
                        open={this.props.error && this.state.showError && !this.state.loading}
                        verticalOffset={-125}
                        horizontalOffset={150}
                        position="bottom right"
                        basic={true}
                        style={errorStyle}
                    >
                        Вы ввели некорректные данные.
                    </Popup>
                    <Form>
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите логин'}
                            error={this.state.showError}
                            onChange={this.changeLogin}
                        />
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите пароль'}
                            type={'password'}
                            error={this.state.showError}
                            onChange={this.changePassword}
                        />
                            <Button
                                className={f('button').toString()}
                                type={'submit'}
                                loading={this.state.loading}
                                onClick={this.onLogin}
                            >
                                    Войти
                            </Button>
                        <NavLink className={f('link').toString()} to={PathConstants.SIGNUP}>
                            Регистрация
                        </NavLink>
                    </Form>
                </div>
            </div>
        );
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
            loading: true,
            showError: true
        });
    }
}
