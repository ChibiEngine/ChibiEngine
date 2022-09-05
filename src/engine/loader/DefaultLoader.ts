import Resource from "../resource/Resource";
import Loader from "./Loader";

export default class DefaultLoader implements Loader {
    // Resource by path
    public readonly resources: Map<string, Resource> = new Map();

    private onResourceDestroy(resource: Resource) {
        this.resources.delete(resource.path);
    }

    public load<T extends Resource>(dependency: T): T {
        let existing = this.resources.get(dependency.id) as T;
        if (existing) {
            existing.retain();
            return existing;
        }else{
            this.resources.set(dependency.id, dependency);
            dependency.onDestroy.subscribe(this.onResourceDestroy);
            dependency.retain();
            dependency.loadSelf();
            return dependency;
        }
    }
}