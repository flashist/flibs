import { BaseObject } from "fcore";
import { Point } from "../../index";
export declare class InputManager extends BaseObject {
    protected static _instance: InputManager;
    private pressedKeyCodes;
    private prevPressedKeyCodes;
    private justPressedKeyCodes;
    private justReleasedKeyCodes;
    private isDataChanged;
    private lastGlobalInteractionPos;
    protected constructor(...args: any[]);
    protected addListeners(): void;
    protected removeListeners(): void;
    protected onStageUp(): void;
    protected onStageDown(): void;
    protected onTick(): void;
    protected onKeyDown(event: KeyboardEvent): void;
    protected onKeyPress(event: KeyboardEvent): void;
    protected onKeyUp(event: KeyboardEvent): void;
    protected updateInput(): void;
    checkIfKeyJustPressed(keyCode: number): Boolean;
    checkIfKeyJustReleased(keyCode: number): boolean;
    checkIfKeyDown(keyCode: number): boolean;
    getLastGlobalInteractionPos(): Point;
    static get instance(): InputManager;
}
