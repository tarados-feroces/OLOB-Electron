import * as React from 'react';
import { block } from 'bem-cn';
import { SignupData } from '../../modules/HttpApi';

import './index.scss';

import { Button, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';

interface SignupProps {
    onSignup?(data: SignupData): void;
    isAuthorized: boolean;
}

const b = block('olob-signup');

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
                <div className={b('container').toString()}>
                    <Form className={b('forms').toString()}>
                        <input placeholder={'Введите логин'} ref={this.loginRef} />
                        <input placeholder={'Введите email'} ref={this.emailRef} />
                        <input
                            placeholder={'Введите пароль'}
                            type={'password'}
                            ref={this.passwordRef}
                        />
                        <input
                            placeholder={'Повторите пароль'}
                            type={'password'}
                            ref={this.repeatPasswordRef}
                        />
                        <Button type={'submit'} inverted={true} onClick={this.onSignup}>Войти</Button>
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
