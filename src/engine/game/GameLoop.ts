export default class GameLoop {
    private _lastTime: number;
    private _delta: number;

    private _running: boolean;
    private _requestId: number;

    private _update: (delta: number) => void;

    public constructor() {
        this._lastTime = 0;
        this._delta = 0;

        this._running = false;
        this._requestId = 0;

        this._update = () => {};
    }

    public start(update: (delta: number) => void) {
        this._update = update;
        this._running = true;
        this._requestId = requestAnimationFrame(this._tick);
    }

    public stop() {
        this._running = false;
        cancelAnimationFrame(this._requestId);
    }

    private _tick = (time: number) => {
        if (!this._running) {
            return;
        }

        this._delta = time - this._lastTime;
        this._lastTime = time;

        this._update(this._delta);
        this._requestId = requestAnimationFrame(this._tick);
    };
}