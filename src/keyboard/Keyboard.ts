import Event from "../event/Event";

namespace Keyboard {
    const _downKeys: Set<string> = new Set();
    const _downKeysTime: Map<string, number> = new Map();

    export const onKeyDown: Event<KeyboardEvent> = new Event();
    export const onKeyUp: Event<KeyboardEvent> = new Event();
    export const onKeyPressed: Event<KeyboardEvent> = new Event();

    document.addEventListener("keydown", (e: KeyboardEvent) => {
        if(_downKeys.has(e.key)) {
            return;
        }
        _downKeys.add(e.key);
        _downKeysTime.set(e.key, performance.now());
        onKeyDown.trigger(e);
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
        _downKeys.delete(e.key);
        onKeyUp.trigger(e);
        onKeyPressed.trigger(e);
        // _downKeysTime.set(e.key, performance.now()-1);
    });

    export function downKeys() {
        return _downKeys;
    }

    export function isKeyDown(key: string) {
        return _downKeys.has(key);
    }

    export function wasKeyDown(key: string, dt: number) {
        return isKeyDown(key) || _downKeysTime.has(key) && performance.now() - _downKeysTime.get(key) < dt;
    }
}

export default Keyboard;