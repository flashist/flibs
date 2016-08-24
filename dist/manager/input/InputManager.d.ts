import { BaseEventListenerObject } from "fcore/dist/index";
export declare class InputManager extends BaseEventListenerObject {
    protected static _instance: InputManager;
    private pressedKeyCodes;
    private prevPressedKeyCodes;
    private justPressedKeyCodes;
    private justReleasedKeyCodes;
    private isDataChanged;
    constructor();
    protected construction(): void;
    protected addListeners(): void;
    protected onTick(): void;
    protected onKeyDown(event: KeyboardEvent): void;
    protected onKeyPress(event: KeyboardEvent): void;
    protected onKeyUp(event: KeyboardEvent): void;
    protected updateInput(): void;
    checkIfKeyJustPressed(keyCode: number): Boolean;
    checkIfKeyJustReleased(keyCode: number): boolean;
    checkIfKeyDown(keyCode: number): boolean;
    static instance: InputManager;
}
