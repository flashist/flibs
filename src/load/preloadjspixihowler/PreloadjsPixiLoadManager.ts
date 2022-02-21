import {AbstractLoadManager} from "../abstract/AbstractLoadManager";
import {AbstractLoadFactory} from "../abstract/AbstractLoadFactory";
import {PreloadjsPixiLoadFactory} from "./PreloadjsPixiLoadFactory";

export class PreloadjsPixiLoadManager extends AbstractLoadManager {
    constructor() {
        super();

        AbstractLoadFactory.instance = new PreloadjsPixiLoadFactory();
    }
}