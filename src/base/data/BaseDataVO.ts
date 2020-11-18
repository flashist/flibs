import {ObjectTools, BaseEventDispatcher} from "@flashist/fcore";

import {IGenericObjectVO} from "../..";
import {BaseDataVOEvent} from "./BaseDataVOEvent";

export class BaseDataVO extends BaseEventDispatcher implements IGenericObjectVO {

    public type: string = "";
    public id: string = "";

    protected explicitSourcePropertyNames: (keyof this)[];
    protected ignoreSourcePropertyNames: (keyof this)[];

    update(source: Partial<this>): void {
        const isChanged: boolean = ObjectTools.copyProps(this, source);

        if (isChanged) {
            this.dispatchEvent(BaseDataVOEvent.CHANGE);
        }
    }

    public get sourceJsonObj(): Partial<this> {
        let sourceObj: Partial<this> = {};

        if (this.explicitSourcePropertyNames || this.ignoreSourcePropertyNames) {
            for (let keyName in this) {
                let isIgnored: boolean = false;
                if (this.ignoreSourcePropertyNames) {
                    if (this.ignoreSourcePropertyNames.indexOf(keyName) !== -1) {
                        isIgnored = true;
                    }
                }

                let isNeedToCopy: boolean = false;
                if (!isIgnored) {
                    if (this.explicitSourcePropertyNames) {
                        if (this.explicitSourcePropertyNames.indexOf(keyName) !== -1) {
                            isNeedToCopy = true;
                        }

                    } else {
                        isNeedToCopy = true;
                    }
                }

                if (isNeedToCopy) {
                    ObjectTools.copySingleProp(
                        sourceObj,
                        this,
                        keyName
                    );
                }
            }
        }

        return sourceObj;
    }

    public get sourceJsonText(): string {
        return JSON.stringify(this.sourceJsonObj);
    }
}
