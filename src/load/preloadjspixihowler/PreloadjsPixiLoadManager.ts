import { AbstractLoadManager } from "../abstract/AbstractLoadManager";
import { AbstractLoadFactory } from "../abstract/AbstractLoadFactory";
import { PreloadjsPixiLoadFactory } from "./PreloadjsPixiLoadFactory";

export class PreloadjsPixiLoadManager extends AbstractLoadManager {
    constructor() {
        super();

        AbstractLoadFactory.instance = new PreloadjsPixiLoadFactory();
    }
}

// TODO: change when more adapters are supported,
// probably builds of the flibs should be separated per adapter
export class LoadManager extends PreloadjsPixiLoadManager {
}