import * as React from 'react';

import { block } from 'bem-cn';

import './index.scss';
import Title from '../../ui/Title';
import SlideShow from '../../components/SlideShow';
import Section from '../../components/Section';

const b = block('main-page');

const textObject = {
    'Что это?':
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.`,
    'Что мы даем?': [ 'Lol', 'Kek', 'Cheburek' ],
    'Для кого наш продукт?' :
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. А так - точно для всех!`
};

export default class MainPage extends React.Component {
    public render() {
        return (
            <div className={b()}>
                <div className={b('header')}>
                    <Title text={'On-Line-On-Board !!!'} size={'large'} />
                </div>
                <div className={b('section')}>
                    <div className={b('slideshow-container')}>
                        <SlideShow />
                    </div>
                </div>
                <div className={b('section')}>
                    <Section
                        title={'Hello World!'}
                        imageSrc={'./images/team.jpg'}
                        text={textObject['Для кого наш продукт?']}
                        buttonText={'Buy me'}
                        imageLeft={false}
                    />
                </div>
                <div className={b('section')}>
                    <Section
                        title={'Hello World!'}
                        imageSrc={'./images/team.jpg'}
                        text={textObject['Для кого наш продукт?']}
                        buttonText={'Buy me'}
                        imageLeft={true}
                    />
                </div>
            </div>
        );
    }
}
