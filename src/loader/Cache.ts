import Resource from "../resource/Resource";

namespace Cache {
  // Resource by path
  export const resources: Map<string, Resource> = new Map();

  function onResourceDestroy(resource: Resource) {
    resources.delete(resource.id);
  }

  export function load<T extends Resource>(dependency: T): T {
    let existing = resources.get(dependency.id) as T;
    if (existing) {
      existing.retain();
      return existing;
    } else {
      resources.set(dependency.id, dependency);
      dependency.onDestroy.subscribe(onResourceDestroy);
      dependency.retain();
      dependency.create();
      return dependency;
    }
  }
}

export default Cache;