export function scrollBottom(node: HTMLElement) {
    if (!node) {
        return;
    }

    node.scrollTo(0, node.scrollHeight);
}
