import {AssociativeArray, BaseObject, Lock} from "@flashist/fcore";

import {TweenLite} from "gsap";

import {Sound} from "../../index";
import {SoundsManagerEvent} from "./SoundsManagerEvent";

export abstract class AbstractSoundsManager extends BaseObject {

    protected soundsToIdMap: AssociativeArray<Sound> = new AssociativeArray<Sound>();

    protected disableLock: Lock = new Lock();
    private _enabled: boolean = false;

    private _isActivated: boolean;
    private _isMuted: boolean;

    private _tweenVolumeValue: number;

    public defaultTweenTime: number = 0.5;

    protected volume: number = 1;

    protected construction(...args): void {
        super.construction(...args);

        this.disableLock = new Lock();

        this.setVolume(this.volume);

        this.calculateEnabled();
    }

    public registerSound(id: string, sound: Sound): void {
        this.soundsToIdMap.push(sound, id);
    }

    public getSound(id: string): Sound {
        return this.soundsToIdMap.getItem(id);
    }

    // ENABLED: START

    /**
     * Used to disable (aka mute) Sounds Manager (e.g. when focus is lost / tab is switched).
     * It's different from the mute value, because the mute value will be controlled by the sound control buttons
     * and saved / restored from the local storage (aka save system)
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    protected calculateEnabled(): void {
        const prevEnabled: boolean = this.enabled;

        const newEnabled: boolean = !this.disableLock.enabled;
        this._enabled = newEnabled;

        if (newEnabled !== prevEnabled) {
            this.dispatchEvent(SoundsManagerEvent.ENABLED_CHANGE);
        }

        this.commitData();
    }

    public addDisableLock(locker: any): void {
        this.disableLock.add(locker);

        this.calculateEnabled();
    }

    public removeDisableLock(locker: any): void {
        this.disableLock.remove(locker);

        this.calculateEnabled();
    }

    // ENABLED: END

    public get isActivated(): boolean {
        return this._isActivated;
    }

    public activate(): void {
        this._isActivated = true;
        this.commitData();
    }

    get isMuted(): boolean {
        return this._isMuted;
    }

    set isMuted(value: boolean) {
        if (value === this.isMuted) {
            return;
        }

        this._isMuted = value;
        this.dispatchEvent(SoundsManagerEvent.IS_MUTED_CHANGE);

        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        if (!this.isActivated) {
            return;
        }

        let newVolume: number = this.getVolume();
        if (this.isMuted) {
            newVolume = 0;
        }
        if (!this.enabled) {
            newVolume = 0;
        }

        // this.internalSetVolume(newVolume);
        this.internalSetVolume(newVolume)
    }

    // VOLUME: START

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