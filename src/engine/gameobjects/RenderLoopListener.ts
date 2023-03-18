export default interface RenderLoopListener {
    render(dt: number): void;
}

export function isRenderLoopListener(object: any): object is RenderLoopListener {
    return "render" in object;
}