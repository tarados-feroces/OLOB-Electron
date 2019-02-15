import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Button, Image, Jumbotron } from 'react-bootstrap';

interface SectionProps {
    onClick?(): void;
    buttonText?: string;
    text?: string;
    title: string;
    imageSrc?: string;
    imageLeft?: boolean;
}

const b = block('section');

export default class Section extends React.Component<SectionProps> {
    public render() {
        const { title, text, imageSrc, buttonText, onClick, imageLeft } = this.props;

        return (
            <div className={b()} style={{ flexDirection: imageLeft ? 'row' : 'row-reverse' }}>
                <div className={b('item')}>
                    {imageSrc && <Image src={imageSrc} style={{ width: '400px', height: '400px' }} />}
                </div>
                <div className={b('item')}>
                    <Jumbotron style={{ width: '400px', height: '400px', borderRadius: '0px', marginBottom: 0 }}>
                        <h1>{title}</h1>
                        <p>{text}</p>
                        {buttonText && <Button variant="primary" onClick={onClick}>{buttonText}</Button>}
                    </Jumbotron>
                </div>
            </div>
        );
    }
}
