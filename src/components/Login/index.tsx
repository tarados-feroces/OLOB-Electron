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

const b = block('olob-login');

export default class Login extends React.Component<LoginProps> {
    public render() {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Form className={b('forms')}>
                                    <Form.Input label={'Введите логин'} placeholder={'Введите логин'} />
                                    <Form.Input label={'Введите пароль'} placeholder={'Введите пароль'} type={'password'} />
                                    <Button type={'submit'} inverted={true}>Войти</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        );
    }
}
