import Event from "../event/Event";

namespace Keyboard {
    const downKeys: Set<string> = new Set();

    export const onKeyDown: Event<KeyboardEvent> = new Event();
    export const onKeyUp: Event<KeyboardEvent> = new Event();
    export const onKeyPressed: Event<KeyboardEvent> = new Event();

    document.addEventListener("keydown", (e: KeyboardEvent) => {
        downKeys.add(e.key);
        onKeyDown.trigger(e);
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
        downKeys.delete(e.key);
        onKeyUp.trigger(e);
        onKeyPressed.trigger(e);
    });

    export function isKeyDown(arrowUp: string) {
        return downKeys.has(arrowUp);
    }
}

export default Keyboard;