import Resource from "../resource/Resource";

namespace ResourceManager {
  // Resource by path
  export const resources: Map<string, Resource> = new Map();

  export function get<T extends Resource>(dependency: T): T {
    let existing = resources.get(dependency.id) as T;
    existing?.retain();
    return existing;
  }

  export function create<T extends Resource>(dependency: T): T {
    resources.set(dependency.id, dependency);
    dependency.onDestroy.subscribe(remove);
    dependency.retain();
    dependency.create();
    return dependency;
  }

  export function getOrCreate<T extends Resource>(dependency: T): T {
    return get(dependency) || create(dependency);
  }

  export function remove(resource: Resource) {
    resources.delete(resource.id);
  }
}

export default ResourceManager;