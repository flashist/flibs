import {AssociativeArray, BaseObject, Lock} from "@flashist/fcore";

import {TweenLite} from "gsap";

import {Sound} from "../../index";
import {SoundsManagerEvent} from "./SoundsManagerEvent";

export abstract class AbstractSoundsManager extends BaseObject {

    protected soundsToIdMap: AssociativeArray<Sound> = new AssociativeArray<Sound>();

    protected mutedLock: Lock = new Lock();
    protected muteLock: Lock = new Lock();

    private _isMuted: boolean = false;
    private _enabled: boolean = true;

    private _tweenVolumeValue: number;

    public defaultTweenTime: number = 0.5;

    protected volume: number = 1;

    protected construction(...args): void {
        super.construction(...args);

        this.mutedLock = new Lock();

        this.setVolume(this.volume);
    }

    public registerSound(id: string, sound: Sound): void {
        this.soundsToIdMap.push(sound, id);
    }

    public getSound(id: string): Sound {
        return this.soundsToIdMap.getItem(id);
    }

    public addDisableLock(locker: any): void {
        this.mutedLock.add(locker);

        this.calculateEnabled();
    }

    public removeDisableLock(locker: any): void {
        this.mutedLock.remove(locker);

        this.calculateEnabled();
    }


    public addMuteLock(locker: any): void {
        this.muteLock.add(locker);

        this.calculateMuted();
    }
    public removeMuteLock(locker: any): void {
        this.muteLock.remove(locker);

        this.calculateMuted();
    }

    public get isMuted(): boolean {
        return this._isMuted;
    }

    protected calculateMuted(): void {
        const prevIsMuted: boolean = this.enabled;

        const newIsMuted: boolean = !this.mutedLock.enabled;
        this._isMuted = newIsMuted;

        if (this.enabled !== prevIsMuted) {
            this.dispatchEvent(SoundsManagerEvent.IS_MUTED_CHANGE);
        }

        this.commitData();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    protected calculateEnabled(): void {
        const prevEnabled: boolean = this.enabled;

        const newEnabled: boolean = !this.mutedLock.enabled;
        this._enabled = newEnabled;

        if (this.enabled !== prevEnabled) {
            this.dispatchEvent(SoundsManagerEvent.ENABLED_CHANGE);
        }

        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        if (!this.enabled) {
            return;
        }

        let newVolume: number = this.getVolume();
        if (this.isMuted) {
            newVolume = 0;
        }

        // this.internalSetVolume(newVolume);
        this.internalSetVolume(newVolume)
    }

    public getVolume(): number {
        return this.volume;
    }

    public setVolume(value: number): void {
        TweenLite.killTweensOf(this);
        this.volume = value;

        this.dispatchEvent(SoundsManagerEvent.VOLUME_CHANGE);

        this.commitData();
    }
    protected abstract internalSetVolume(value: number): void;

    public tweenVolume(volume: number, time?: number, onComplete?: Function): void {
        if (!time && time !== 0) {
            time = this.defaultTweenTime;
        }

        this.tweenVolumeValue = this.getVolume();

        TweenLite.killTweensOf(this);
        TweenLite.to(
            this,
            time,
            {
                tweenVolumeValue: volume,

                onComplete: () => {
                    if (onComplete) {
                        onComplete();
                    }
                }
            }
        );
    }

    protected get tweenVolumeValue(): number {
        return this._tweenVolumeValue;
    }
    protected set tweenVolumeValue(value: number) {
        if (value === this._tweenVolumeValue) {
            return;
        }

        this._tweenVolumeValue = value;
        this.setVolume(this._tweenVolumeValue);
    }

}