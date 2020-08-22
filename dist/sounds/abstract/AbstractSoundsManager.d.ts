import { Lock, AssociativeArray, BaseObject } from "fcore";
import { Sound } from "../../index";
export declare abstract class AbstractSoundsManager extends BaseObject {
    protected soundsToIdMap: AssociativeArray<Sound>;
    protected disableLock: Lock;
    private _isMuted;
    private _enabled;
    private _tweenVolumeValue;
    defaultTweenTime: number;
    protected volume: number;
    protected construction(...args: any[]): void;
    registerSound(id: string, sound: Sound): void;
    getSound(id: string): Sound;
    addDisableLock(locker: any): void;
    removeDisableLock(locker: any): void;
    get isMuted(): boolean;
    set isMuted(value: boolean);
    get enabled(): boolean;
    protected calculateEnabled(): void;
    protected commitData(): void;
    getVolume(): number;
    setVolume(value: number): void;
    protected abstract internalSetVolume(value: number): void;
    tweenVolume(volume: number, time?: number, onComplete?: Function): void;
    protected get tweenVolumeValue(): number;
    protected set tweenVolumeValue(value: number);
}
