import Resource from "../resource/Resource";

export default interface Loader {
    load<T extends Resource>(dependency: T): T
}