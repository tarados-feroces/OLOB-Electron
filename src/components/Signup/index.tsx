import * as React from 'react';
import { block } from 'bem-cn';
import { SignupData } from '../../modules/HttpApi';
import { Button, Input, Popup } from 'semantic-ui-react';
import * as PathConstants from '../../constants/PathsConstants';
import Form from '../../ui/Form';
import { History } from 'history';

interface OwnProps {
    history?: History;
}

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
    showError: boolean;
}

type SignupProps = OwnProps & ReduxProps;

const b = block('olob-login');
const f = block('ui-form');

export default class Login extends React.Component<SignupProps, SignupState> {
    private errorRef = React.createRef<HTMLDivElement>();
    private loadingTimeout;
    private errorTimeout;

    constructor(props: SignupProps) {
        super(props);
        this.state = {
            loading: false,
            login: '',
            email: '',
            password: '',
            passwordRepeat: '',
            showError: false
        };
    }

    public componentDidUpdate(prevProps: Readonly<SignupProps>, prevState: Readonly<SignupState>) {
        if (prevState.loading !== this.state.loading) {
            this.loadingTimeout = setTimeout(() => {
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
            this.errorTimeout = setTimeout(() => {
                this.setState({
                    showError: false
                });
            }, 2000);
        }
    }

    public render() {
        if (this.props.isAuthorized) {
            this.props.history.push(PathConstants.AUTH);

            return (<div />);
        }

        const errorStyle = {
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 'lighter',
            color: '#cc1600'
        };

        return (
            <div className={b()}>
                <div className={b('title')}>
                    Регистрация
                </div>
                <div className={b('container').toString()} ref={this.errorRef}>
                    <Popup
                        context={this.errorRef.current}
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
                            id={'login'}
                            className={f('item').toString()}
                            placeholder={'Введите логин'}
                            onChange={this.changeData}
                            error={this.props.error}
                        />
                        <Input
                            id={'email'}
                            className={f('item').toString()}
                            placeholder={'Введите email'}
                            onChange={this.changeData}
                            error={this.props.error}
                        />
                        <Input
                            id={'password'}
                            className={f('item').toString()}
                            placeholder={'Введите пароль'}
                            type={'password'}
                            onChange={this.changeData}
                            error={this.props.error}
                        />
                        <Input
                            id={'passwordRepeat'}
                            className={f('item').toString()}
                            placeholder={'Повторите пароль'}
                            type={'password'}
                            onChange={this.changeData}
                            error={this.props.error}
                        />
                        <Button
                            className={f('button').toString()}
                            type={'submit'}
                            onClick={this.onSignup}
                            loading={this.state.loading}
                        >
                            Присоединиться
                        </Button>
                        <div className={f('link').toString()} onClick={this.goToLogin}>
                            Уже есть аккаунт?
                        </div>
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

    private changeData = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    private goToLogin = () => {
        this.props.history.push(PathConstants.LOGIN);
    }
}
