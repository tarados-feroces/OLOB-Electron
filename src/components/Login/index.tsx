import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { Button, Form } from 'semantic-ui-react';

interface LoginData {
    nickname: string;
    password: string;
}

interface LoginProps {
    onLogin?(data: LoginData): void;
}

const b = block('olob-login');

export default class Login extends React.Component<LoginProps> {
    public render() {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Form>
                        <Form.Input label={'Введите логин'} placeholder={'Введите логин'} />
                        <Form.Input label={'Введите пароль'} placeholder={'Введите пароль'} type={'password'} />
                        <Button type={'submit'}>Submit</Button>
                    </Form>
                </div>
            </div>
        );
    }
}
