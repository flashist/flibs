import {
    App,
    FStage,
    AppProperties,
    Point,
    Ticker
} from "../../../index";

export class FApp extends App {

    private static _instance: FApp;

    public stage: FStage;

    protected fpsLimitterEnabled: boolean;
    protected lastTimeRendered: number = 0;
    protected targetRenderInterval: number;

    public ticker: Ticker;

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

        this.ticker = Ticker.shared;

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
        return this.renderer.plugins.interaction.eventData.data.global.clone();
    }


    public static get instance(): FApp {
        return FApp._instance;
    }
}