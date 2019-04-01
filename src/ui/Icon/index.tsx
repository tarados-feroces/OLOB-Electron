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
        <object type="image/svg+xml" className={b({ size })} data={`./images/icons/${id}.svg`} >
            {/* <use xlinkHref={`#images/icons/${id}.svg`} /> */}
        </object>
    );
};
