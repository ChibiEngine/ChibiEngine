import Event from "../event/Event";
import type Blob from "./Blob";
import Cache from "./Cache";
import type Resource from "../resource/Resource";


// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default abstract class Loadable {
    public abstract readonly type: string;

    public _parent: Loadable;
    // TODO: pb si les sous-classes utilisent un LoaderInfoAggregate
    public readonly onProgress: Event<this> = new Event<this>();
    public readonly onLoaded: Event<this> = new Event<this>();

    public readonly dependencies: Loadable[] = [];
    public readonly blobs: Blob[] = [];

    private _isLoaded: boolean = false;
    private _isLoading: boolean = false;

    protected constructor() {
        this.onDependencyLoaded = this.onDependencyLoaded.bind(this);
    }

    public addBlob(blob: Blob) {
        for(const child of this.blobs) {
            if(child.id === blob.id) return;
        }
        this.blobs.push(blob);
        if(this._parent) {
            this._parent.addBlob(blob);
        }
    }

    /**
     * Charge une dépendance (explicit loading)
     * @param dependency
     */
    public load<T extends Loadable>(dependency: T): T {
        dependency._parent = this;
        if(dependency.type === "resource") {
            // TODO: cast bizarre à revoir
            Cache.load(dependency as any);
        } else {
            dependency.create();
        }
        if(dependency.type === "blob") {
            // Si c'est un blob, appeler addBlob
            this.addBlob(dependency as any);
            dependency.onProgress.subscribe(() => this.onProgress.trigger(this));
        }
        this.dependencies.push(dependency);
        dependency.loaded.then(this.onDependencyLoaded);
        return dependency;
    }

    private onDependencyLoaded(_: Loadable) {
        if(this.isLoaded) {
            this.onLoaded.trigger(this);
        }
    }

    public async create() {
        // On set le parent de la dépendance comme ça lorsqu'il appellera this.load, il pourra faire remonter les appels
        this.loading();
        await this._create()
        this.finishLoading();
    }

    protected abstract _create(): Promise<void>;

    /**
     * Détruit l'objet et libère ses ressources.
     */
    public async destroy() {
        const promises = [];
        for(const dependency of this.dependencies) {
            promises.push(dependency.destroy());
        }
        await Promise.all(promises);
        await this._destroy();
    }

    protected abstract _destroy(): Promise<void>;

    public loading() {
        this._isLoading = true;
        this._isLoaded = false;
    }

    public finishLoading() {
        this._isLoading = false;
        this._isLoaded = true;
        if(this.allDependenciesLoaded()) {
            this.onLoaded.trigger(this);
        }
    }

    public get loaded(): Promise<this> {
        return this.onLoaded.promise;
    }

    public get isLoaded() {
        return this._isLoaded && this.allDependenciesLoaded();
    }

    public get isLoading() {
        return this._isLoading || this.hasDependencyLoading();
    }

    private allDependenciesLoaded(): boolean {
        return !this.dependencies.some(dep => !dep.isLoaded);
    }

    private hasDependencyLoading(): boolean {
        return this.dependencies.some(dep => dep.isLoading);
    }

    public get bytesLoaded(): number {
        return [...this.blobs].reduce((sum, child) => sum + child.bytesLoaded, 0);
    }

    public get bytesTotal(): number {
        return [...this.blobs].reduce((sum, child) => sum + child.bytesTotal, 0);
    }
}
