import {Event, EventListener} from "../event/Event";
import type Blob from "./resources/Blob";
import ResourceManager from "./ResourceManager";
import InstantEvent from "../event/InstantEvent";
import makeProxy from "../utils/makeProxy";


// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default abstract class Loadable {
    public abstract readonly type: string;

    public readonly onProgress: Event<this> = new Event<this>();
    public readonly onLoaded: InstantEvent<this> = new InstantEvent<this>();

    public readonly dependencies: Loadable[] = [];
    public readonly dependants: Loadable[] = [];
    public readonly blobs: Blob[] = [];
    private readonly dependencyListeners: EventListener<any>[] = [];

    private _isCreating: boolean = false;
    private _isCreated: boolean = false;

    protected constructor() {
        this.onDependencyLoaded = this.onDependencyLoaded.bind(this);
        this.setThenMethod();
    }

    private setThenMethod() {
        // @ts-ignore
        //
        // TypeScript doesn't like awaiting a Thenable :
        // If a class has a then() method it must conform to a valid PromiseLike signature
        // But if we do so, TypeScript complains because the PromiseLike resolves to itself (indeed we want: await this.load(dep) === dep) (TS1062)
        // The solution is not to declare a then() method and assign it dynamically to make TypeScript think it's not a Promise, so it resolves "await dependency" to the dependency itself (await 5 === 5)
        // and then delete the then() method once it is resolved to avoid cyclic resolving
        this.then = (resolve, _) => {
            this.onLoaded.subscribeOnce(() => {
                //@ts-ignore
                delete this.then;
                resolve(this);
                this.setThenMethod();
            });
            return this;
        }
    }

    public asPromise(): this & PromiseLike<this> {
        return this as this & PromiseLike<this>;
    }

    public get loaded(): this & PromiseLike<this> {
        return this.asPromise();
    }

    public addBlob(...blobs: Blob[]) {
        for(const blob of blobs) {
            for(const child of this.blobs) {
                if(child.id === blob.id) return;
            }
            blob.onProgress.subscribe(() => this.onProgress.trigger(this));
            this.blobs.push(blob);
            for (const dependant of this.dependants) {
                dependant.addBlob(blob);
            }
        }
    }

    /**
     * Load a dependency (explicit loading)
     * This method is asynchronous and resolves when the dependency is loaded.
     * @param dependency
     */
    public load<T extends Loadable>(dependency: T): T & PromiseLike<T> {
        if(dependency.type === "resource" || dependency.type === "blob") {
            const fromCache = ResourceManager.getOrCreate(dependency as any);
            if(fromCache !== dependency) {
                makeProxy(dependency, fromCache);
            }
            dependency.dependants.push(this);
            if(dependency.type === "resource") {
                this.addBlob(...dependency.blobs);
            } else {
                this.addBlob(dependency as unknown as Blob);
            }
        } else {
            dependency.dependants.push(this);
            dependency.create();
        }

        // This object depends on dependency to be created.
        this.dependencies.push(dependency);
        const listener = dependency.onLoaded.subscribe(this.onDependencyLoaded);
        this.dependencyListeners.push(listener);
        // Turn this back to unloaded.
        this.onLoaded.reset();

        return dependency as T & PromiseLike<T>;
    }

    private onDependencyLoaded(_: Loadable) {
        if(this.isLoaded) {
            this.onLoaded.trigger(this);
            this.dependencyListeners.forEach(e => e.unsubscribe());
        }
    }

    public async create() {
        this.loadingStart();
        await this._create()
        this.loadingEnd();
    }

    // TODO: pass the scene as parameter ?
    protected abstract _create(): Promise<void>;

    /**
     * Détruit l'objet et libère ses ressources.
     */
    public async destroy() {
        await this._destroy();
        const promises = [];
        for(const dependency of this.dependencies) {
            this.willDestroyDependency(dependency);
            promises.push(dependency.destroy());
        }
        await Promise.all(promises);
    }

    protected willDestroyDependency(dependency: Loadable) {
        // To override
    }

    protected abstract _destroy(): Promise<void>;

    protected loadingStart() {
        this._isCreating = true;
        this._isCreated = false;
    }

    protected loadingEnd() {
        this._isCreating = false;
        this._isCreated = true;

        if(this.allDependenciesLoaded()) {
            this.onLoaded.trigger(this);
            this.dependencyListeners.forEach(e => e.unsubscribe());
        }
    }

    public whenLoaded(callback: (loadable: this) => void) {
        // TODO : duplicates onLoaded event?
        // this should be handled by the event itself
        if(this.isLoaded) {
            callback(this);
        } else {
            this.onLoaded.subscribeOnce(callback);
        }
    }

    public get isLoaded() {
        return this._isCreated && this.allDependenciesLoaded();
    }

    public get isLoading() {
        return this._isCreating || this.hasDependencyLoading();
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
