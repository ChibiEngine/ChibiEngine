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
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.unpause();
            }
        });
    }

    public start(update: (delta: number) => void) {
        this._update = update;
        this._running = true;
        this._requestId = requestAnimationFrame(this._tick);
    }

    public pause() {
        this._running = false;
        cancelAnimationFrame(this._requestId);
    }

    public unpause() {
        this._running = true;
        this._lastTime = performance.now();
        this._requestId = requestAnimationFrame(this._tick);
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