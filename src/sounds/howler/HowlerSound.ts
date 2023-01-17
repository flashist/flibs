import { Howl } from "howler";

import { AbstractSound } from "../abstract/AbstractSound";
import { IHowlerSoundConfig } from "./IHowlerSoundConfig";
import { ISoundConfig } from "../..";
import { IPlaySoundConfig } from "../abstract/IPlaySoundConfig";

export class HowlerSound extends AbstractSound {

    protected config: IHowlerSoundConfig;

    public engineSound: Howl;

    constructor(config: IHowlerSoundConfig) {
        super(config);
    }

    protected construction(config: IHowlerSoundConfig): void {
        super.construction(config);

        this.engineSound = new Howl({ src: this.config.src, preload: this.config.preload });
    }

    destruction(): void {
        super.destruction();

        if (this.engineSound) {
            this.engineSound.unload();
            this.engineSound = null;
        }
    }

    getVolume(): number {
        return this.engineSound.volume();
    }

    protected internalSetVolume(value: number): void {
        this.engineSound.volume(value);
    }

    play(config?: IPlaySoundConfig): void {
        if (!config) {
            config = {};
        }

        this.engineSound.loop(config.loop);
        this.engineSound.play();
    }

    stop(): void {
        this.engineSound.stop();
    }

    /*
    public src: string;
    public id: string;

    protected engineSound: Howl;

    constructor(id: string, src: string) {
        super(id, src);
    }

    protected construction(id: string, src: string): void {
        super.construction();

        this.src = src;
        this.id = id;

        this.engineSound = new Howl({src: this.src});
    }

    public play(): void {
        this.engineSound.play();
    }

    public stop(): void {
        this.engineSound.stop();
    }

    public get volume(): number {
        return this.engineSound.volume();
    }

    public set volume(value: number) {
        if (value === this.volume) {
            return;
        }

        this.engineSound.volume(value);
    }

    public tweenVolume(volume: number, time: number, onComplete?: Function): void {
        TweenLite.killTweensOf(this);
        TweenLite.to(
            this,
            time,
            {
                volume: volume,
                onComplete: () => {
                    if (onComplete) {
                        onComplete();
                    }
                }
            }
        );
    }

    /!*public getLoadingStatus(): LoadStatus {
        let result: LoadStatus = LoadStatus.WAIT;
        switch (this.engineSound.state()) {
            case "loading":
                result = LoadStatus.LOADING;
                break;
            case "loaded":
                result = LoadStatus.COMPLETE;
                break;
        }

        return result;
    }*!/*/
}