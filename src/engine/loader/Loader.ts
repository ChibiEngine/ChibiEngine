import Resource from "../resource/Resource";
import { LoadablePromise } from "./Loadable";

export default interface Loader {
    load<T extends Resource>(dependency: T): LoadablePromise<T>
}