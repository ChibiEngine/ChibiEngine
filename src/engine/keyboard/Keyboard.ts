import Event from "../event/Event";

namespace Keyboard {
    export const onKeyDown: Event<KeyboardEvent> = new Event();
    export const onKeyUp: Event<KeyboardEvent> = new Event();
    export const onKeyPressed: Event<KeyboardEvent> = new Event();

    export function isKeyDown(key: any) {
        // TODO: implement
    }
}

export default Keyboard;