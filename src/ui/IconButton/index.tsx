import * as React from 'react';
import { block } from 'bem-cn';

import { Icon, IconSize } from '../Icon';

import './index.scss';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'button';
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    type: 'link';
}

type IconButtonProps = (ButtonProps | LinkProps) & {
    icon: string;
    size?: IconSize;
    disabled?: boolean;
    onPress?(event: React.MouseEvent | React.TouchEvent): void;
};

const b = block('ui-icon-button');

const IconButton: React.SFC<IconButtonProps> = ({ children, icon, size, onPress, disabled, ...props }) => {
    const className = b({ disabled }).mix(props.className);

    const content = (
        <>
            <Icon id={icon} size={size} />
            {children}
        </>
    );

    if (props.type === 'link') {
        return (
            <a
                target="_blank"
                {...props}
                className={className}
            >
                {content}
            </a>
        );
    }

    return (
        <div {...props} className={className}>
            {content}
        </div>
    );
};

export default IconButton;
