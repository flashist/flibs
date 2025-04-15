import {
    FStage,
    Point
} from "../../../../index";
import { App } from "../App";

export class FApp extends App {

    private static _instance: FApp;

    public stage: FStage;

    protected fpsLimitterEnabled: boolean;
    protected lastTimeRendered: number = 0;
    protected targetRenderInterval: number;

    constructor() {
        super();

        // if (this.options.targetFps) {
        //     this.fpsLimitterEnabled = true;
        //     this.targetRenderInterval = 1000 / this.options.targetFps;
        // }

        FApp._instance = this;

        // FStage
        this.stage.isFStage = true;

        // // TEST
        // const origRender = this.render;
        // //
        // (this as any).render = () => {
        //     return origRender;
        // };
    }

    // public render(force?: boolean): void {
    //     if (!force && this.fpsLimitterEnabled) {
    //         let tempDelta: number = Date.now() - this.lastTimeRendered;
    //         if (tempDelta >= this.targetRenderInterval) {
    //             this.lastTimeRendered = Date.now();

    //             super.render();
    //         }

    //     } else {
    //         super.render();
    //     }
    // }

    public getGlobalInteractionPosition(): Point {
        // return (this.renderer.plugins as RendererPlugins).interaction.mouse.global;
        // return this.renderer.plugins.interaction.eventData.data.global.clone();
        // return this.plugins.interaction.pointer.global.clone();

        // TODO: fix and find a way for accessing global pointer position in the v8
        return this.renderer.events.pointer.screen.clone();
    }


    public static get instance(): FApp {
        return FApp._instance;
    }
}