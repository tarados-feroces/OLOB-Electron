import { block } from 'bem-cn';
import * as React from 'react';

import { Image } from 'semantic-ui-react';

import './index.scss';

interface AvatarProps {
    src: string;
    className?: string;
}

const b = block('ui-avatar');

export const Avatar: React.FunctionComponent<AvatarProps> = ({ src, className }) => {
    return (
        <div className={b.mix(className)}>
            <Image className={b('image').toString()} src={src} />
        </div>
    );
};
