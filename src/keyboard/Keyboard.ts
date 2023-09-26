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

    /**
     * @param key The key to check (see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)
     * @param dt Check if the key was down in the last dt milliseconds
     */
    export function isKeyDown(key: string, dt?: number) {
        if(dt) {
            return _downKeys.has(key) || _downKeysTime.has(key) && performance.now() - _downKeysTime.get(key) < dt;
        }
        return _downKeys.has(key);
    }
}

export default Keyboard;