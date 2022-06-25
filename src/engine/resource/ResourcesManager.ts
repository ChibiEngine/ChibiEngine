import Resource from "./Resource";

// Resource by path
const resources: Map<String, Resource> = new Map();

function onResourceDestroy(resource: Resource) {
  resources.delete(resource.path);
}

export async function loadResource<T extends Resource>(resource: T): Promise<T> {
  const actual = resources.get(resource.path);
  if (actual) {
    if (!actual.loaded) {
      await actual.onLoaded.promise();
    }
    return resource;
  }
  resources.set(resource.path, resource);
  resource.onDestroy.subscribe(onResourceDestroy);
  return resource.load();
}
