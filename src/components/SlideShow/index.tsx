import * as React from 'react';

import { block } from 'bem-cn';

import './index.scss';
import TextBlock from '../../ui/TextBlock';
import Title from '../../ui/Title';
import { Carousel, Button } from 'react-bootstrap';

interface SlideShowProps {
    onBuyClick?(): void;
    onGalleryClick?(): void;
}

interface SlideShowState {
    index: number;
}

const b = block('slideshow');

export default class SlideShow extends React.Component<SlideShowProps, SlideShowState> {
    public state = {
        index: 0
    };

    private handleSelect = (selectedIndex: number) => {
        this.setState({
            index: selectedIndex
        });
    }

    public render() {
        const { onBuyClick, onGalleryClick } = this.props;
        const { index } = this.state;

        return (
            <Carousel
                activeIndex={index}
                onSelect={this.handleSelect}
                className={b()}
            >
                <Carousel.Item>
                    <img
                        className={b('slide-back').mix('d-block w-100')}
                        src="https://i.ytimg.com/vi/-CBiVN7N-4k/maxresdefault.jpg"
                    />
                    <Carousel.Caption>
                        {/* <Title text={'Our board'} className={b('slide-header')} /> */}
                        <Button variant={'outline-light'} size={'lg'} disabled={true} onClick={onBuyClick}>
                            Buy Now!
                        </Button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className={b('slide-back').mix('d-block w-100')}
                    />
                    <Carousel.Caption>
                        <Button variant={'outline-light'} size={'lg'} disabled={true} onClick={onGalleryClick}>
                            Go to our gallery
                        </Button>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        );
    }
}
