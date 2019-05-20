import { Action } from '../typings/boardTypings';

export function diffToString(diff: Action): string {
    return `${diff.x} ${diff.y} ${diff.action}`;
}

export function stringToDiff(diffStr: string): Action | null {
    const diffOpts = diffStr.split(' ');

    if (diffOpts.length !== 3) {
        return null;
    }

    const diff: Action = {
        x: Number(diffOpts[0]),
        y: Number(diffOpts[1]),
        action: Number(diffOpts[2])
    };

    return diff;
}
