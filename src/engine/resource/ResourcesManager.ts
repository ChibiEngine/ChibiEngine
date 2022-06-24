import Resource from "./Resource";

// Resource by path
const resources: Map<String, Resource<any>> = new Map();

function onResourceDestroy(resource: Resource<any>) {
  resources.delete(resource.path);
}

export async function loadResource<T>(resource: Resource<T>) {
  const actual = resources.get(resource.path);
  if (actual) {
    if (!actual.loaded) {
      await actual.onLoaded.join();
    }
    resource.set(actual.get());
    return resource;
  }
  resources.set(resource.path, resource);
  resource.onDestroy.subscribe(onResourceDestroy);
  return resource.load();
}
