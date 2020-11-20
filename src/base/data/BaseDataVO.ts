import {ObjectTools, BaseEventDispatcher} from "@flashist/fcore";

import {IGenericObjectVO} from "../..";
import {BaseDataVOEvent} from "./BaseDataVOEvent";

export class BaseDataVO extends BaseEventDispatcher implements IGenericObjectVO {

    public type: string = "";
    public id: string = "";

    protected explicitSourcePropertyNames: string[] = [];

    update(source: Partial<this>): void {
        const isChanged: boolean = ObjectTools.copyProps(this, source);

        if (isChanged) {
            this.dispatchEvent(BaseDataVOEvent.CHANGE);
        }
    }

    public get sourceJsonObj(): Partial<this> {
        let sourceObj: Partial<this> = {};

        let copyKeys: string[] = this.explicitSourcePropertyNames as any;
        if (!copyKeys || copyKeys.length > 0) {
            copyKeys = Object.keys(this);
        }

        for (let keyName of copyKeys) {
            ObjectTools.copySingleProp(
                sourceObj,
                this,
                keyName
            );
        }

        return sourceObj;
    }

    public get sourceJsonText(): string {
        return JSON.stringify(this.sourceJsonObj);
    }
}
