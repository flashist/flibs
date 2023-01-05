import { BaseObject, EventListenerHelper } from "@flashist/fcore";

import { ILoadItemConfig } from "./ILoadItemConfig";
import { LoadStatus } from "../loadstatus/LoadStatus";
import { IErrorVO } from "../data/IErrorVO";
import { LoadStatusEvent } from "../loadstatus/LoadStatusEvent";
import { LoadEvent } from "../LoadEvent";
import { LoadResourcesCache } from "../LoadResourcesCache";

export abstract class AbstractLoadItem<DataType extends any = any> extends BaseObject<DataType> {

    public progress: number;
    public errorData: IErrorVO;

    public sourceData: any;

    private _status: LoadStatus = LoadStatus.WAIT;

    protected eventListenerHelper: EventListenerHelper;

    protected startPromise: Promise<void>;
    protected startPromiseResolve: Function;
    protected startPromiseReject: Function;

    public dependencies: AbstractLoadItem[];

    constructor(public config: ILoadItemConfig) {
        super();

        this.internalPrepare();
    }

    protected internalPrepare(): void {
        this.eventListenerHelper = new EventListenerHelper(this);
        this.dependencies = [];
    }

    start(): Promise<void> {
        if (this.startPromise) {
            return this.startPromise;
        }

        this.startPromise = new Promise(
            (resolve: Function, reject: Function) => {
                this.startPromiseResolve = resolve;
                this.startPromiseReject = reject;
                
                if (this.status === LoadStatus.LOADING) {
                    return;
                }
                this.status = LoadStatus.LOADING;
        
                // If there are dependencies, start dependencies first
                const dependencyLoadPromisses: Promise<void>[] = [];
                for (let singleDependency of this.dependencies) {
                    dependencyLoadPromisses.push(singleDependency.start());
                }

                Promise.all(dependencyLoadPromisses)
                    .then(
                        () => {
                            this.addLoadingListeners();
                            this.internalStart();
                        }
                    )
                    .catch(
                        (error) =>{
                            this.processLoadingError(error)
                        }
                    )
            }
        );
    }

    protected internalStart(): void {
        // Override if needed
    }

    stop(): void {
        if (this.status === LoadStatus.WAIT) {
            return;
        }
        this.status = LoadStatus.WAIT;

        this.removeLoadingListeners();

        this.internalStop();
    }

    protected internalStop(): void {
        // Override if needed
    }

    protected addLoadingListeners(): void {
        // Override if needed
    }

    protected removeLoadingListeners(): void {
        this.eventListenerHelper.removeAllListeners();
    }


    protected processLoadingProgress(progress: number): void {
        this.progress = progress;

        this.dispatchEvent(LoadEvent.PROGRESS);
    }

    protected processLoadingComplete(sourceData: any, data: any): void {
        this.sourceData = sourceData;
        this.data = data;
        this.status = LoadStatus.COMPLETE;

        LoadResourcesCache.add(this.config.id, data);

        this.removeLoadingListeners();
        
        this.dispatchEvent(LoadEvent.COMPLETE);
        this.startPromiseResolve();
    }

    protected processLoadingError(errorData: IErrorVO): void {
        this.errorData = errorData;
        this.status = LoadStatus.ERROR;

        this.removeLoadingListeners();

        this.dispatchEvent(LoadEvent.ERROR);
        this.startPromiseReject();
    }

    public getIsSuccess(): boolean {
        return !this.errorData;
    }

    get status(): LoadStatus {
        return this._status;
    }
    set status(value: LoadStatus) {
        if (value === this.status) {
            return;
        }

        this._status = value;

        this.dispatchEvent(LoadStatusEvent.STATUS_CHANGE);
    }

    /*public onComplete(data: any): void {
        this.success = true;

        this.data = data;

        this.dispatchEvent(LoadItemEvent.COMPLETE);
    }

    public onError(errorCode: string): void {
        this.success = false;
        this.errorCode = errorCode;

        this.dispatchEvent(LoadItemEvent.ERROR);
    }

    public onProgress(progress: number): void {
        this.progress = progress;

        this.dispatchEvent(LoadItemEvent.PROGRESS);
    }*/
}