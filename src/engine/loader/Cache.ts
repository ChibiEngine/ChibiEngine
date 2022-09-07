import Resource from "../resource/Resource";
import Loadable from "./Loadable";

module Cache {
  // Resource by path
  export const resources: Map<string, Resource> = new Map();

  function onResourceDestroy(resource: Resource) {
    resources.delete(resource.id);
  }

  export function load<T extends Resource>(dependency: T) {
    let existing = resources.get(dependency.id) as T;
    if (existing) {
      existing.retain();
      dependency.reference = existing;
    } else {
      resources.set(dependency.id, dependency);
      dependency.onDestroy.subscribe(onResourceDestroy);
      dependency.retain();
      dependency.create();
    }
  }
}

export default Cache;