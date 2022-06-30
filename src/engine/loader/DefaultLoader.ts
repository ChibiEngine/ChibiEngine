import Resource from "../resource/Resource";
import { LoadablePromise } from "./Loadable";
import Loader from "./Loader";

export default class DefaultLoader implements Loader {
    // Resource by path
    private readonly resources: Map<string, Resource> = new Map();

    private onResourceDestroy(resource: Resource) {
        this.resources.delete(resource.path);
    }

    public load<T extends Resource>(dependency: T): LoadablePromise<T> {
        const promise = (async () => {
            const actual = this.resources.get(dependency.path);
            if (actual) {
                if (!actual.loaded) {
                    await actual.onLoaded.promise();
                }
                return dependency;
            }
            this.resources.set(dependency.path, dependency);
            dependency.onDestroy.subscribe(this.onResourceDestroy);
            return dependency.load();

        })();
        return Object.assign(dependency, promise);
    }
}