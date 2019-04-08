import { block } from 'bem-cn';
import * as React from 'react';

import './index.scss';

export type IconSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

interface IconProps {
    /** ID иконки */
    id: string;
    /**
     * Размер иконки
     *
     * @default 'm'
     */
    size?: IconSize;
}

const b = block('ui-icon');

export const Icon: React.FunctionComponent<IconProps> = ({ id, size = 'm' }) => {
    return (
        <img className={b({ size })} src={`./images/icons/${id}.svg`} />
    );
};
