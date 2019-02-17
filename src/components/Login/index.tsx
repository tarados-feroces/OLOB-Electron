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
                                <Form>
                                    <Form.Input
                                        label={'Введите логин'}
                                        placeholder={'Введите логин'}
                                        onChange={this.handleInputNickname}
                                    />
                                    <Form.Input
                                        label={'Введите пароль'}
                                        placeholder={'Введите пароль'}
                                        type={'password'}
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

    private handleInputNickname = (event) => {
        // if (!this.userNameRef.current) {
        //     return;
        // }

        this.setState({ nickname: event.target.value });
    }

    private handleInputPassword = (event) => {
        // if (!this.passwordRef.current) {
        //     return;
        // }

        this.setState({ password: event.target.value });
    }

    private handleSubmit = () => {
        if (this.props.onLogin) {
            this.props.onLogin(this.state);
        }
    }
}
