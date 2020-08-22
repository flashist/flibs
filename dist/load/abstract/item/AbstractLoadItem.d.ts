import { BaseObject, EventListenerHelper } from "fcore";
import { ILoadItemConfig } from "./ILoadItemConfig";
import { LoadStatus } from "../loadstatus/LoadStatus";
import { IErrorVO } from "../data/IErrorVO";
export declare abstract class AbstractLoadItem extends BaseObject {
    config: ILoadItemConfig;
    progress: number;
    errorData: IErrorVO;
    private _status;
    protected eventListenerHelper: EventListenerHelper;
    constructor(config: ILoadItemConfig);
    protected internalPrepare(): void;
    start(): void;
    protected internalStart(): void;
    stop(): void;
    protected internalStop(): void;
    protected addLoadingListeners(): void;
    protected removeLoadingListeners(): void;
    protected processLoadingProgress(progress: number): void;
    protected processLoadingComplete(data: any): void;
    protected processLoadingError(errorData: IErrorVO): void;
    getIsSuccess(): boolean;
    get status(): LoadStatus;
    set status(value: LoadStatus);
}
