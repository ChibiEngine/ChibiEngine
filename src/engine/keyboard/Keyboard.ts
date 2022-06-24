import Event from "../event/Event";

module Keyboard {
    export const onKeyDown: Event<KeyboardEvent> = new Event();
    export const onKeyUp: Event<KeyboardEvent> = new Event();
    export const onKeyPressed: Event<KeyboardEvent> = new Event();

    export function isKeyDown(key: any) {
    
    }
}

export default Keyboard;