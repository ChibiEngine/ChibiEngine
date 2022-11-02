import Event from "../event/Event";
import type Blob from "../resource/Blob";
import Cache from "./Cache";
import InstantEvent from "../event/InstantEvent";


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
     * @param dependency
     */
    public load<T extends Loadable>(dependency: T): T {
        // TODO : améliorer ce code moche
        if(dependency.type === "resource") {
            // TODO: cast bizarre à revoir
            dependency = Cache.load(dependency as any);
            dependency.dependants.push(this);
            this.addBlob(...dependency.blobs);
        } else if (dependency.type !== "blob") {
            dependency.dependants.push(this);
            dependency.create();
        } else {
            dependency = Cache.load(dependency as any);
            dependency.dependants.push(this);
            // Si c'est un blob, appeler addBlob
            this.addBlob(dependency as any);
        }
        this.dependencies.push(dependency);
        dependency.onLoaded.subscribeOnce(this.onDependencyLoaded);


        // For whatever reason, TypeScript doesn't like awaiting a Thenable
        // TODO : fix this

        //@ts-ignore
        dependency.then = (resolve, _) => {
            dependency.onLoaded.subscribeOnce(() => {
                //@ts-ignore
                delete dependency.then;
                resolve(dependency);
            });
        }

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
