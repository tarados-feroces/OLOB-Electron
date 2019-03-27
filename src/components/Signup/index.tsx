import * as React from 'react';
import { block } from 'bem-cn';
import { SignupData } from '../../modules/HttpApi';

import { Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import Form from '../../ui/Form';

interface SignupProps {
    onSignup?(data: SignupData): void;
    isAuthorized: boolean;
}

const b = block('olob-login');
const f = block('ui-form');

export default class Login extends React.Component<SignupProps> {
    private loginRef = React.createRef<HTMLInputElement>();
    private emailRef = React.createRef<HTMLInputElement>();
    private passwordRef = React.createRef<HTMLInputElement>();
    private repeatPasswordRef = React.createRef<HTMLInputElement>();

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
                        <input className={f('item').toString()} placeholder={'Введите логин'} ref={this.loginRef} />
                        <input className={f('item').toString()} placeholder={'Введите email'} ref={this.emailRef} />
                        <input
                            className={f('item').toString()}
                            placeholder={'Введите пароль'}
                            type={'password'}
                            ref={this.passwordRef}
                        />
                        <input
                            className={f('item').toString()}
                            placeholder={'Повторите пароль'}
                            type={'password'}
                            ref={this.repeatPasswordRef}
                        />
                        <Button
                            className={f('button').toString()}
                            type={'submit'}
                            inverted={true}
                            onClick={this.onSignup}
                        >
                            Войти
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

    private onSignup = () => {
        if (this.passwordRef.current.value !== this.repeatPasswordRef.current.value) {
            return;
        }
        this.props.onSignup({
            login: this.loginRef.current.value,
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value
        });
    }
}
