import * as React from 'react';
import { block } from 'bem-cn';

import { Image, Input, Form as SForm, Modal, Popup, Dimmer, Loader } from 'semantic-ui-react';
import Form from '../../ui/Form';
import Button from '../../ui/Button';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import './index.scss';
import { UpdateUserData } from '../../modules/HttpApi';

interface AvatarChangeOptions {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface OwnProps {}

interface ReduxProps {
    onSubmit?(data: UpdateUserData): void;
    onOpenInfoPopup?(description: string, data: object): void;
    onChangeAvatar?(newAvatar: string, options?: AvatarChangeOptions): void;
    login?: string;
    avatar?: string;
    error?: boolean;
    newAvatar?: string;
    loading?: boolean;
}

type UserInfoProps = OwnProps & ReduxProps;

interface UserInfoState {
    login: string;
    avatar: string | ArrayBuffer;
    showModal: boolean;
    newAvatar: string | ArrayBuffer;
    avatarChangeOptions?: AvatarChangeOptions;
    showError: boolean;
}

const b = block('olob-user-info');
const f = block('ui-form');

export default class UserInfo extends React.Component<UserInfoProps, UserInfoState> {
    private fileReader: FileReader = new FileReader();
    private errorTimeout;

    public state: UserInfoState = {
        login: this.props.login,
        avatar: this.props.avatar,
        showModal: false,
        newAvatar: '',
        showError: false
    };

    public componentWillUnmount() {
        this.props.onChangeAvatar('');
        clearTimeout(this.errorTimeout);
    }

    public componentDidUpdate(prevProps: Readonly<OwnProps & ReduxProps>, prevState: Readonly<UserInfoState>) {
        if (prevProps.error !== this.props.error && this.props.error) {
            this.setState({
                showError: true
            });

            this.errorTimeout = setTimeout(() => {
                this.setState({
                    showError: false
                });
            }, 2000);
        }
    }

    private getLoginInput = () => {
        return (
            <Input
                id={'login'}
                onChange={this.changeData}
                value={this.state.login}
                label={'Логин'}
            />
        );
    }

    public render() {
        const { error, newAvatar, loading } = this.props;
        const errorStyle = {
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 'lighter',
            color: '#cc1600'
        };

        if (loading) {
            return (
                <div className={b()} >
                    <Dimmer active={true}>
                        <Loader content="Loading" />
                    </Dimmer>
                </div>
            );
        }

        return (
            <>
                <div className={b()}>
                    <div className={b('content')}>
                        <Image className={b('avatar').toString()} src={newAvatar || this.state.avatar} />
                        <Button className={b('file-upload-btn').toString()} size={'mini'}>
                            <input
                                id={'avatar'}
                                className={b('file-upload').toString()}
                                onChange={this.changeAvatar}
                                type={'file'}
                            />
                            Изменить
                        </Button>
                        <div className={b('form')}>
                            <Form>
                                <SForm.Field inline={true} className={f('item').toString()}>
                                    <Popup
                                        trigger={this.getLoginInput()}
                                        closeOnDocumentClick={true}
                                        content={'Такой логин уже занят!'}
                                        open={this.state.showError}
                                        position={'top center'}
                                        style={errorStyle}
                                    />
                                </SForm.Field>
                            </Form>
                        </div>
                        <Button
                            className={b('button').toString()}
                            type={'submit'}
                            onClick={this.updateInfo}
                            negative={error}
                        >
                            Обновить
                        </Button>
                    </div>
                </div>
                {this.renderModal()}
            </>
        );
    }

    private renderModal = () => {
        const { newAvatar, showModal } = this.state;
        const m = block('avatar-modal');

        return (
            <Modal open={showModal} onClose={this.closeModal}>
                <Modal.Header>Выберите область</Modal.Header>
                <Modal.Content>
                    <Cropper
                        src={newAvatar}
                        style={{ maxHeight: 500, maxWidth: '100%' }}
                        // Cropper.js options
                        aspectRatio={9 / 9}
                        guides={false}
                        crop={this.handleAvatarResize}
                    />
                    <div className={m('confirm-avatar')}>
                        <Button className={m('confirm-avatar-button')} onClick={this.onConfirmAvatar}>
                            Готово!
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }

    private changeData = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    private updateInfo = () => {
        const { login } = this.state;
        const { newAvatar } = this.props;

        const newData: UpdateUserData = {};

        if (login !== this.props.login) {
            newData.login = login;
        }

        if (newAvatar) {
            newData.avatar = newAvatar;
        }

        this.props.onSubmit(newData);
    }

    private changeAvatar = (event) => {
        const files = event.target.files;
        const file = files[files.length - 1];
        const fileReader: FileReader = new FileReader();

        fileReader.readAsDataURL(file);

        const fileExtention = file.name.split('.').pop();

        if (/(jpg|png|jpeg|svg)/gi.test(fileExtention)) {
            fileReader.onload = () => {
                this.setState({
                    newAvatar: fileReader.result
                });
                this.openModal();
            };
        } else {
            this.props.onOpenInfoPopup(
                'Ошибка',
                { text: 'Вы загрузили не картинку', buttonText: 'Ок' }
            );
        }
    }

    private openModal = () => {
        this.setState({ showModal: true });
    }

    private closeModal = () => {
        this.setState({ showModal: false });
    }

    private onConfirmAvatar = () => {
        const { newAvatar, avatarChangeOptions } = this.state;

        if (this.props.onChangeAvatar) {
            this.props.onChangeAvatar(newAvatar.toString(), avatarChangeOptions);
        }

        this.closeModal();
    }

    private handleAvatarResize = (event) => {
        const { x, y, width, height } = event.detail;

        const avatarChangeOptions: AvatarChangeOptions = {
            top: Math.floor(y),
            left: Math.floor(x),
            width: Math.floor(width),
            height: Math.floor(height)
        };

        this.setState({
            avatarChangeOptions
        });
    }
}
