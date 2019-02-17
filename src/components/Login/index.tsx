import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { Button, Form, Grid } from 'semantic-ui-react';

interface LoginData {
    nickname: string;
    password: string;
}

interface LoginProps {
    onLogin?(data: LoginData): void;
}

interface LoginState {
    nickname: string;
    password: string;
}

const b = block('olob-login');

export default class Login extends React.Component<LoginProps> {
    private userNameRef = React.createRef<HTMLInputElement>();
    private passwordRef = React.createRef<HTMLInputElement>();

    public state = {
        nickname: '',
        password: ''
    };

    public render() {
        const { onLogin } = this.props;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Form className={b('forms')}>
                                    <Form.Input
                                        label={'Введите логин'}
                                        placeholder={'Введите логин'}
                                        ref={this.userNameRef}
                                        onChange={this.handleInputNickname}
                                    />
                                    <Form.Input
                                        label={'Введите пароль'}
                                        placeholder={'Введите пароль'}
                                        type={'password'}
                                        ref={this.passwordRef}
                                        onChange={this.handleInputPassword}
                                    />
                                    <Button type={'submit'} inverted={true} onClick={this.handleSubmit}>Войти</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        );
    }

    private handleInputNickname = () => {
        if (!this.userNameRef.current) {
            return;
        }

        this.setState({ nickname: this.userNameRef.current.value });
    }

    private handleInputPassword = () => {
        if (!this.passwordRef.current) {
            return;
        }

        this.setState({ password: this.passwordRef.current.value });
    }

    private handleSubmit = () => {
        if (this.props.onLogin) {
            this.props.onLogin(this.state);
        }
    }
}
