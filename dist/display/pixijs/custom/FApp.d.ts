import { App, FStage, AppProperties, Point } from "../../../index";
export declare class FApp extends App {
    protected options?: any | AppProperties;
    private static _instance;
    stage: FStage;
    protected fpsLimitterEnabled: boolean;
    protected lastTimeRendered: number;
    protected targetRenderInterval: number;
    constructor(options?: any | AppProperties);
    render(force?: boolean): void;
    getGlobalInteractionPosition(): Point;
    static get instance(): FApp;
}
