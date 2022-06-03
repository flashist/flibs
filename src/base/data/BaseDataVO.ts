import { ArrayTools, ObjectTools, BaseEventDispatcher } from "@flashist/fcore";

import { IGenericObjectVO } from "../..";
import { BaseDataVOEvent } from "./BaseDataVOEvent";

export class BaseDataVO extends BaseEventDispatcher implements IGenericObjectVO {

    public type: string = "";
    public id: string = "";

    protected explicitSourcePropertyNames: string[] = [];
    protected ignoreSourcePropertyNames: string[] = [];
    protected addSourcePropertyNames: string[] = [];
    protected copyAsLinkPropertyNames: string[] = [];

    constructor(sourceData?: any, ...args) {
        super(sourceData, ...args);

        this.ignoreSourcePropertyNames.push(
            "eventEmitter",
            "explicitSourcePropertyNames",
            "ignoreSourcePropertyNames",
            "addSourcePropertyNames",
            "copyAsLinkPropertyNames"
        );

        if (sourceData) {
            this.update(sourceData);
        }
    }

    update(source: Partial<this>): void {
        const isChanged: boolean = ObjectTools.copyProps(this, source);

        const copyKeyNames: string[] = Object.keys(source);
        for (let keyName of copyKeyNames) {
            if (this.copyAsLinkPropertyNames.indexOf(keyName) === -1) {
                ObjectTools.copySingleProp(
                    this,
                    source,
                    keyName
                );
            } else {
                this[keyName] = source[keyName];
            }
        }

        if (isChanged) {
            this.dispatchEvent(BaseDataVOEvent.CHANGE);
        }
    }

    public get sourceJsonObj(): Partial<this> {
        let sourceObj: Partial<this> = {};

        let copyKeyNames: string[] = this.explicitSourcePropertyNames;
        if (!copyKeyNames || copyKeyNames.length <= 0) {
            copyKeyNames = Object.keys(this);
        }

        if (this.addSourcePropertyNames?.length > 0) {
            copyKeyNames.push(...this.addSourcePropertyNames);
        }

        if (this.ignoreSourcePropertyNames?.length > 0) {
            ArrayTools.removeItems(copyKeyNames, this.ignoreSourcePropertyNames);
        }

        // Include getter + setter combinations
        const proto: any = Object.getPrototypeOf(this);
        for (const propertyName of Object.getOwnPropertyNames(proto)) {
            const propertyDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);
            let canParseGetSetProperty: boolean = false;
            if (propertyDescriptor &&
                (typeof propertyDescriptor.get === 'function') && (typeof propertyDescriptor.set === 'function')) {

                canParseGetSetProperty = true;
            }

            if (canParseGetSetProperty) {
                copyKeyNames.push(propertyName);

                // Automatically remove private properties associated with get+set combinations,
                // because the connected to it get+set combination will be used
                ArrayTools.removeItem(copyKeyNames, "_" + propertyName);
            }
        }

        // Sort to make it look prettier
        copyKeyNames.sort();

        for (let keyName of copyKeyNames) {
            if (this.copyAsLinkPropertyNames.indexOf(keyName) === -1) {
                ObjectTools.copySingleProp(
                    sourceObj,
                    this,
                    keyName
                );
            } else {
                sourceObj[keyName] = this[keyName];
            }
        }

        return sourceObj;
    }

    public get sourceJsonText(): string {
        return JSON.stringify(this.sourceJsonObj);
    }
}
