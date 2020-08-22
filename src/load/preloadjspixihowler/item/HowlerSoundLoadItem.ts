import {StringTools} from "fcore";

import {Howl} from "howler";

import {HowlerSound} from "../../../sounds/howler/HowlerSound";
import {HowlerSoundEvent} from "../../../sounds/howler/HowlerSoundEvent";
import {AbstractSoundLoadItem} from "../../abstract/item/AbstractSoundLoadItem";
import {getInstance, SoundsManager} from "../../../index";


export class HowlerSoundLoadItem extends AbstractSoundLoadItem {

    // TODO: figure out how it would be possible to separate sounds and loading-sounds classes,
    // at least without using injection, as injection might not be prepared for the sounds manager
    // if we remove injection here, we might add injection to the sounds manager itself,
    // but it would not resolve the problem, only relocate it
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    public sound: HowlerSound;

    protected internalPrepare(): void {
        super.internalPrepare();

        let src: string | string[] = this.config.src;
        if (this.config.extensions && this.config.extensions.length) {
            src = [];

            let extCount: number = this.config.extensions.length;
            for (let extIndex: number = 0; extIndex < extCount; extIndex++) {
                src.push(
                    StringTools.substitute(
                        this.config.src,
                        {
                            extension: this.config.extensions[extIndex]
                        }
                    )
                );
            }
        }

        this.sound = new HowlerSound({
            id: this.config.id,
            src: src,
            preload: false
        });
    }

    protected internalStart(): void {
        super.internalStart();

        this.sound.engineSound.load();
    }

    protected internalStop(): void {
        super.internalStop();

        if (this.sound) {
            this.sound.destruction();
        }
    }

    protected addLoadingListeners(): void {
        super.addLoadingListeners();

        /*this.fileCompleteBinding = this.loader.onLoad.add(
            (loader: loaders.Loader, resource: loaders.Resource) => {
                console.log(args);
            }
        );*/
        this.sound.engineSound.on(
            HowlerSoundEvent.LOAD,
            () => {
                this.processLoadingComplete(this.sound.engineSound);
            }
        );
        /*this.completeBinding = this.sound.onComplete.add(
            (loader: PIXI.loaders.Loader, resourcesMap: {[key: string]: PIXI.loaders.Resource}) => {
                this.processLoadingComplete(resourcesMap);
            }
        );*/

        /*this.errorBinding = this.sound.onError.add(
            (error: any, loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource) => {
                this.processLoadingError(
                    {
                        data: error,
                        errorCode: error.toString
                    }
                );
            }
        );*/
        this.sound.engineSound.on(
            HowlerSoundEvent.LOAD_ERROR,
            (soundId: number, error: any) => {
                this.processLoadingError({errorCode: error, data: error});
            }
        );
    }

    protected removeLoadingListeners(): void {
        super.removeLoadingListeners();

        if (!this.sound) {
            return;
        }

        /*this.sound.onProgress.detach(this.progressBinding);
        // this.loader.onLoad.detach(this.fileCompleteBinding);
        this.sound.onComplete.detach(this.completeBinding);
        this.sound.onError.detach(this.errorBinding);*/
        this.sound.engineSound.off(HowlerSoundEvent.LOAD);
        this.sound.engineSound.off(HowlerSoundEvent.LOAD_ERROR);
    }

    protected processLoadingComplete(data: any): void {
        super.processLoadingComplete(data);

        this.soundsManager.registerSound(
            this.config.id,
            this.sound
        );
    }
}