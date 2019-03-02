import * as React from 'react';
import { block } from 'bem-cn';
import { LoginData } from '../../modules/HttpApi';

import './index.scss';

import { Button, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';

interface LoginProps {
    onLogin?(data: LoginData): void;
    isAuthorized: boolean;
}

interface LoginState {
    nickname: string;
    password: string;
}

const b = block('olob-login');

export default class Login extends React.Component<LoginProps> {
    private loginRef = React.createRef<HTMLInputElement>();
    private passwordRef = React.createRef<HTMLInputElement>();

    public render() {
        if (this.props.isAuthorized) {
            return (
                <Redirect to={PathConstants.AUTH} />
            );
        }

        return (
            <div className={b()}>
                <div className={b('container').toString()}>
                    <Form className={b('forms').toString()}>
                        <input placeholder={'Введите логин'} ref={this.loginRef} />
                        <input
                            placeholder={'Введите пароль'}
                            type={'password'}
                            ref={this.passwordRef}
                        />
                        <Button type={'submit'} inverted={true} onClick={this.onLogin}>Войти</Button>
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
    }
}
