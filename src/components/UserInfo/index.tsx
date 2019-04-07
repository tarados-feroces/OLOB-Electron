import * as React from 'react';
import { block } from 'bem-cn';

import { Button, Image, Input, Label, Form as SForm } from 'semantic-ui-react';
import Form from '../../ui/Form';

import './index.scss';
import { UpdateUserData } from '../../modules/HttpApi';

interface OwnProps {}

interface ReduxProps {
    onSubmit?(data: UpdateUserData): void;
    onOpenInfoPopup?(description: string, data: object): void;
    login?: string;
    avatar?: string;
    error?: boolean;
}

type UserInfoProps = OwnProps & ReduxProps;

interface UserInfoState {
    login?: string;
    avatar?: string | ArrayBuffer;
}

const b = block('olob-user-info');
const f = block('ui-form');

export default class UserInfo extends React.Component<UserInfoProps, UserInfoState> {
    private fileReader: FileReader = new FileReader();

    public state = {
        login: this.props.login,
        avatar: this.props.avatar
    };

    public render() {
        const { error } = this.props;

        return (
            <div className={b()}>
                <div className={b('content')}>
                    <Image className={b('avatar').toString()} src={this.state.avatar} />
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
                                <Input
                                    id={'login'}
                                    onChange={this.changeData}
                                    label={'Логин'}
                                    value={this.state.login}
                                />
                                {/*<Label basic={true} color={'red'} pointing={'left'}>*/}
                                    {/*That name is taken!*/}
                                {/*</Label>*/}
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
        );
    }

    private changeData = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    private updateInfo = () => {
        const newData: UpdateUserData = {};
        Object.keys(this.state).forEach((item) => {
            if (this.state[item] !== this.props[item]) {
                newData[item] = this.state[item];
            }
        });

        this.props.onSubmit(newData);

    }

    private changeAvatar = (event) => {
        const files = event.target.files;
        const file = files[files.length - 1];
        this.fileReader.readAsDataURL(file);

        const fileExtention = file.name.split('.').pop();

        if (!/(jpg|png|jpeg|svg)/gi.test(fileExtention)) {
            this.props.onOpenInfoPopup(
                'Ошибка',
                { text: 'Вы загрузили не картинку', buttonText: 'Ок' }
            );
        } else {
            this.fileReader.onload = () => {
                this.setState({
                    avatar: this.fileReader.result
                });
            };
        }
    }
}
