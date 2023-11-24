export function addKeyboardEvents(elem: any, { onDown, onUp }: {
    onDown?: typeof noop | undefined;
    onUp?: typeof noop | undefined;
}): () => void;
declare function noop(): void;
export {};
