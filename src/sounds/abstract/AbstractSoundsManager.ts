import { AssociativeArray, BaseObject, Lock } from "@flashist/fcore";

import { TweenLite } from "gsap";

import { Sound } from "../../index";
import { SoundsManagerEvent } from "./SoundsManagerEvent";

export abstract class AbstractSoundsManager extends BaseObject {

    protected soundsToIdMap: AssociativeArray<Sound>;

    protected disableLock: Lock;
    private _enabled: boolean;

    private _isActivated: boolean;
    private _isMuted: boolean;

    private _tweenVolumeValue: number;

    public defaultTweenTime: number;
    protected volume: number;

    protected isMutedToTagsMap: { [tag: string]: boolean };

    protected construction(...args): void {
        super.construction(...args);

        this.soundsToIdMap = new AssociativeArray<Sound>();

        this._enabled = false
        this.disableLock = new Lock();

        this.defaultTweenTime = 0.5;
        this.volume = 1;

        this.isMutedToTagsMap = {};

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

        let newVolume: number = this.getVolume();
        if (!this.isActivated) {
            newVolume = 0;
        }
        if (this.isMuted) {
            newVolume = 0;
        }
        if (!this.enabled) {
            newVolume = 0;
        }

        // this.internalSetVolume(newVolume);
        try {
            this.internalSetVolume(newVolume);

        } catch (error) {
            console.log("AbstractSoundsManager | commitData __ error: ", error);
        }

        this.commitTagsData();
    }

    protected commitTagsData(): void {
        this.soundsToIdMap.forEach(
            (item: Sound) => {
                let newVolume: number = 1;
                for (let singleTag of item.config.tags) {
                    if (this.getTagIsMuted(singleTag)) {
                        newVolume = 0;
                        break;
                    }
                }

                item.setVolume(newVolume)
            }
        );
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


    public getTagIsMuted(tag: string): boolean {
        return !!this.isMutedToTagsMap[tag];
    }

    public setTagIsMuted(tag: string, isMuted: boolean): void {
        this.isMutedToTagsMap[tag] = isMuted;

        this.commitTagsData();
    }

    public getMutedTags(): string[] {
        let result: string[] = [];

        const allTags: string[] = Object.keys(this.isMutedToTagsMap);
        for (let singleTag of allTags) {
            if (this.getTagIsMuted(singleTag)) {
                result.push(singleTag);
            }
        }

        return result;
    }
}