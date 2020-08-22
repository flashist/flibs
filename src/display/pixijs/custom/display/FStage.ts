import {
    DisplayObjectContainer
} from "../../../../index";

export abstract class FStage extends DisplayObjectContainer {

    public isFStage: boolean = true;

    static isFStage(object: any): boolean {
        return (object as FStage).isFStage;
    }

}