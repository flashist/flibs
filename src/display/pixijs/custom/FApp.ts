import {
    FStage,
    AppProperties,
    Point
} from "../../../index";
import { App } from "../App";

export class FApp extends App {

    private static _instance: FApp;

    public stage: FStage;

    protected fpsLimitterEnabled: boolean;
    protected lastTimeRendered: number = 0;
    protected targetRenderInterval: number;

    constructor(protected options?: any | AppProperties) {
        super(options);

        this.options = options;
        if (!this.options) {
            this.options = {};
        }

        if (this.options.targetFps) {
            this.fpsLimitterEnabled = true;
            this.targetRenderInterval = 1000 / this.options.targetFps;
        }

        FApp._instance = this;

        // FStage
        this.stage.isFStage = true;
    }

    public render(force?: boolean): void {
        if (!force && this.fpsLimitterEnabled) {
            let tempDelta: number = Date.now() - this.lastTimeRendered;
            if (tempDelta >= this.targetRenderInterval) {
                this.lastTimeRendered = Date.now();

                super.render();
            }

        } else {
            super.render();
        }
    }

    public getGlobalInteractionPosition(): Point {
        // return (this.renderer.plugins as RendererPlugins).interaction.mouse.global;
        // return this.renderer.plugins.interaction.eventData.data.global.clone();
        return this.renderer.plugins.interaction.pointer.global.clone();
    }


    public static get instance(): FApp {
        return FApp._instance;
    }
}