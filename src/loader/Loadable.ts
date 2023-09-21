import Event from "../event/Event";
import type Blob from "../resource/Blob";
import Cache from "./Cache";
import InstantEvent from "../event/InstantEvent";
import makeProxy from "../utils/proxy";


// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default abstract class Loadable {
    // public then?: (resolve: any, reject: any) => void;

    public abstract readonly type: string;

    // TODO: pb si les sous-classes utilisent un LoaderInfoAggregate
    public readonly onProgress: Event<this> = new Event<this>();
    public readonly onLoaded: Event<this> = new InstantEvent<this>();

    public readonly dependencies: Loadable[] = [];
    public readonly dependants: Loadable[] = [];
    public readonly blobs: Blob[] = [];

    private _isLoaded: boolean = false;
    private _isLoading: boolean = false;

    protected constructor() {
        this.onDependencyLoaded = this.onDependencyLoaded.bind(this);
    }

    public addBlob(...blobs: Blob[]) {
        for(const blob of blobs) {
            blob.onProgress.subscribe(() => this.onProgress.trigger(this));
            for(const child of this.blobs) {
                if(child.id === blob.id) return;
            }
            this.blobs.push(blob);
            for (const dependant of this.dependants) {
                dependant.addBlob(blob);
            }
        }
    }

    /**
     * Charge une dépendance (explicit loading)
     * This method is asynchronous and resolves when the dependency is loaded.
     * @param dependency
     */
    public load<T extends Loadable>(dependency: T): T & PromiseLike<T> {
        // TODO : améliorer ce code moche
        if(dependency.type === "resource") {
            // TODO: cast bizarre à revoir
            const fromCache = Cache.load(dependency as any);
            if(fromCache !== dependency) {
                makeProxy(dependency, fromCache);
            }
            dependency.dependants.push(this);
            this.addBlob(...dependency.blobs);
        } else if (dependency.type !== "blob") {
            dependency.dependants.push(this);
            dependency.create();
        } else {
            const fromCache = Cache.load(dependency as any);
            if(fromCache !== dependency) {
                makeProxy(dependency, fromCache);
            }
            dependency.dependants.push(this);
            // Si c'est un blob, appeler addBlob
            this.addBlob(dependency as any);
        }
        this.dependencies.push(dependency);
        dependency.onLoaded.subscribeOnce(this.onDependencyLoaded);

        // TypeScript doesn't like awaiting a Thenable :
        // If a class has a then() method it must conform to a valid PromiseLike signature
        // But if I do so, TypeScript complains because the PromiseLike resolves to itself (because we want: await this.load(dep) === dep)
        // The solution is not to declare a then() method to make TypeScript think it's not a Promise, so it resolves "await dependency" to the dependency itself (await 5 === 5)
        // and to delete the then() method once it is resolved to avoid cyclic resolving

        //@ts-ignore
        dependency.then = (resolve, _) => {
            dependency.onLoaded.subscribeOnce(() => {
                //@ts-ignore
                delete dependency.then;
                resolve(dependency);
            });
        }

        //@ts-ignore
        return dependency;
    }

    private onDependencyLoaded(_: Loadable) {
        if(this.isLoaded) {
            this.onLoaded.trigger(this);
        }
    }

    public async create() {
        // On set le parent de la dépendance comme ça lorsqu'il appellera this.load, il pourra faire remonter les appels
        this.loadingStart();
        await this._create()
        this.loadingEnd();
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

    private loadingStart() {
        this._isLoading = true;
        this._isLoaded = false;
    }

    private loadingEnd() {
        this._isLoading = false;
        this._isLoaded = true;
        if(this.allDependenciesLoaded()) {
            this.onLoaded.trigger(this);
        }
    }

    public whenLoaded(callback: (loadable: this) => void) {
        // TODO : duplicates onLoaded event?
        // this should be handled by the event itself
        if(this.isLoaded) {
            callback(this);
        } else {
            this.onLoaded.subscribeOnce(callback, false);
        }
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
