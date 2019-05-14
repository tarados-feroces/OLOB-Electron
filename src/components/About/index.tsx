import * as React from 'react';
import open from 'open';
import './index.scss';
import block from 'bem-cn';
import { Icon } from 'semantic-ui-react';

const b = block('about');

export default class About extends React.PureComponent {

    public render() {

        return (
            <div className={b()}>
                <div className={b('header')}>
                    О проекте
                </div>
                <div className={b('data')}>
                    Вы можете играть как на доске, так и из приложения.
                    Для подключения доски нажмите на иконку справа и дождитесь соответствующего сообщения
                </div>
                <div className={b('contacts')}>
                    <Icon name={'vk'} />
                    <Icon name={'instagram'} />
                    <a className={b('link')} onClick={this.openSite}>onlineonboard.ru</a>
                </div>
            </div>
        );
    }

    public async openSite() {
        await open('https://onlineonboard.ru');
    }
}
