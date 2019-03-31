import * as React from 'react';
import { block } from 'bem-cn';
import { SignupData } from '../../modules/HttpApi';

import { Button, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import Form from '../../ui/Form';

interface OwnProps {}

interface ReduxProps {
    onSignup?(data: SignupData): void;
    isAuthorized?: boolean;
    error?: boolean;
}

interface SignupState {
    login: string;
    email: string;
    password: string;
    passwordRepeat: string;
    loading: false;
}

type SignupProps = OwnProps & ReduxProps;

const b = block('olob-login');
const f = block('ui-form');

export default class Login extends React.Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props);
        this.state = {
            loading: false,
            login: '',
            email: '',
            password: '',
            passwordRepeat: ''
        };
    }

    public componentDidUpdate(prevProps: Readonly<SignupProps>, prevState: Readonly<SignupState>) {
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
                    Регистрация
                </div>
                <div className={b('container').toString()}>
                    <Form>
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите логин'}
                            onChange={this.changeLogin}
                            error={this.props.error}
                        />
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите email'}
                            onChange={this.changeEmail}
                            error={this.props.error}
                        />
                        <Input
                            className={f('item').toString()}
                            placeholder={'Введите пароль'}
                            type={'password'}
                            onChange={this.changePassword}
                            error={this.props.error}
                        />
                        <Input
                            className={f('item').toString()}
                            placeholder={'Повторите пароль'}
                            type={'password'}
                            onChange={this.changePasswordRepeat}
                            error={this.props.error}
                        />
                        <Button
                            className={f('button').toString()}
                            type={'submit'}
                            inverted={true}
                            onClick={this.onSignup}
                            loading={this.state.loading}
                        >
                            Войти
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

    private onSignup = () => {
        if (this.state.password !== this.state.passwordRepeat) {
            return;
        }

        this.props.onSignup({
            login: this.state.login,
            email: this.state.email,
            password: this.state.password
        });
    }

    private changeLogin = (event) => {
        this.setState({
            login: event.target.value
        });
    }

    private changeEmail = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    private changePassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    private changePasswordRepeat = (event) => {
        this.setState({
            passwordRepeat: event.target.value
        });
    }
}
