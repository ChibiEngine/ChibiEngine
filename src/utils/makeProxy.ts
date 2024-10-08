// @ts-nocheck
import Resource from "../resource/Resource";

/**
 * Limitation : si une propriété de reference est undefined après le chargement, elle ne sera pas dans le proxy
 * @param proxy
 * @param reference
 */
export default function makeProxy<T extends Resource>(proxy: T, reference: T) {
  if(proxy["!PROXY"]) return;

  proxy["!PROXY"] = true;
  // transform proxy into a proxy of reference
  for(const i in reference) {
    if(typeof reference[i] === "function" && !reference[i]["dontProxyFunction"]) {
      proxy[i] = reference[i].bind(reference);
    } else {
      Object.defineProperty(proxy, i, {
        get: () => reference[i],
        set: (value) => reference[i] = value,
      });
    }
  }

  // Ensure new properties are proxied
  reference.onLoaded.subscribeOnce(() => {
    try {
      makeProxy(proxy, reference);
    }catch (e) { }
  });
}