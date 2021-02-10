import {ArrayTools, IEventDispatcher, JSKeyboardEvent, BaseObject} from "@flashist/fcore";
import {
    FApp,
    InteractiveEvent,
    Point
} from "../../index";

import {InputManagerEvent} from "./InputManagerEvent";
import {InputManagerEventData} from "./InputManagerEventData";

export class InputManager extends BaseObject {

    protected static _instance: InputManager;

    private pressedKeyCodes: any = {};
    private prevPressedKeyCodes: any = {};
    private justPressedKeyCodes: any = {};
    private justReleasedKeyCodes: any = {};

    private isDataChanged: boolean;

    private lastGlobalInteractionPos: Point;

    protected constructor(...args) {
        super(...args)
    }

    protected addListeners(): void {
        super.addListeners();

        /*document.addEventListener(JSKeyboardEvent.KEY_DOWN, this.onKeyDown);
         document.addEventListener(JSKeyboardEvent.KEY_UP, this.onKeyUp);*/

        var documentAny: any = (document as any);
        var documentDispatcher: IEventDispatcher<Event> = (documentAny as IEventDispatcher<Event>);
        this.eventListenerHelper.addEventListener(documentDispatcher, JSKeyboardEvent.KEY_DOWN, this.onKeyDown);
        // this.eventListenerHelper.addEventListener(documentDispatcher, JSKeyboardEvent.KEY_PRESS, this.onKeyPress);
        this.eventListenerHelper.addEventListener(documentDispatcher, JSKeyboardEvent.KEY_UP, this.onKeyUp);
        // this.eventListenerHelper.addEventListener(SharedTicker, TickerEvent.TICK, this.onTick);

        this.eventListenerHelper.addEventListener(
            FApp.instance.stage,
            InteractiveEvent.DOWN,
            this.onStageDown
        );

        this.eventListenerHelper.addEventListener(
            FApp.instance.stage,
            InteractiveEvent.UP,
            this.onStageUp
        );

        FApp.instance.ticker.add(this.onTick, this);
    }

    protected removeListeners(): void {
        super.removeListeners();

        FApp.instance.ticker.remove(this.onTick, this);
    }


    protected onStageUp(): void {
        this.lastGlobalInteractionPos = FApp.instance.getGlobalInteractionPosition();
        this.dispatchEvent(InputManagerEvent.STAGE_UP, this.lastGlobalInteractionPos);
    }

    protected onStageDown(): void {
        this.lastGlobalInteractionPos = FApp.instance.getGlobalInteractionPosition();
        this.dispatchEvent(InputManagerEvent.STAGE_DOWN, this.lastGlobalInteractionPos);
    }

    protected onTick(): void {
        this.updateInput();
    }

    protected onKeyDown(event: KeyboardEvent): void {
        //CustomLogger.log("InputManager | onKeyDown __ event.event.keyCode: " + event.keyCode);

        if (!this.pressedKeyCodes[event.code]) {
            this.pressedKeyCodes[event.code] = true;

            this.isDataChanged = true;
        }

        this.updateInput();

        let tempData: InputManagerEventData = new InputManagerEventData((event || window.event));
        tempData.nativeKeyboardEvent = tempData.nativeEvent;

        this.dispatchEvent(InputManagerEvent.KEY_DOWN, tempData);
    }

    /*protected onKeyPress(event: KeyboardEvent): void {
        let tempData: InputManagerEventData = new InputManagerEventData((event || window.event));
        tempData.nativeKeyboardEvent = tempData.nativeEvent;

        this.dispatchEvent(InputManagerEvent.KEY_PRESS, tempData);
    }*/

    protected onKeyUp(event: KeyboardEvent): void {
        if (this.pressedKeyCodes[event.code]) {
            this.pressedKeyCodes[event.code] = false;

            this.isDataChanged = true;
        }

        this.updateInput();

        let tempData: InputManagerEventData = new InputManagerEventData((event || window.event));
        tempData.nativeKeyboardEvent = tempData.nativeEvent;

        this.dispatchEvent(InputManagerEvent.KEY_UP, tempData);
    }


    protected updateInput(): void {
        //CustomLogger.log("InputManager | updateInput __ START");
        //CustomLogger.logCurrentTime();

        if (this.isDataChanged) {
            this.isDataChanged = false;

            var keyCode: string;
            for (keyCode in this.pressedKeyCodes) {
                if (this.pressedKeyCodes[keyCode] && !this.prevPressedKeyCodes[keyCode]) {
                    this.justPressedKeyCodes[keyCode] = true;
                } else {
                    this.justPressedKeyCodes[keyCode] = false;
                }

                if (!this.pressedKeyCodes[keyCode] && this.prevPressedKeyCodes[keyCode]) {
                    this.justReleasedKeyCodes[keyCode] = true;
                } else {
                    this.justReleasedKeyCodes[keyCode] = false;
                }

                this.prevPressedKeyCodes[keyCode] = this.pressedKeyCodes[keyCode];
            }

            this.dispatchEvent(InputManagerEvent.DATA_CHANGE);
        }

        //CustomLogger.logCurrentTime();
        //CustomLogger.log("InputManager | updateInput __ END");
    }


    public checkIfKeyCodeJustPressed(keyCode: string): Boolean {
        return this.justPressedKeyCodes[keyCode];
    }

    public checkIfKeyCodeJustReleased(keyCode: string): boolean {
        return this.justReleasedKeyCodes[keyCode];
    }

    public checkIfKeyCodeDown(keyCode: string): boolean {
        return this.pressedKeyCodes[keyCode];
    }

    public checkIfAnyCodeDown(keyCodes: string[]): boolean {
        return keyCodes.some(
            (code: string) => {
                return !!this.pressedKeyCodes[code];
            }
        )
    }

    public getLastGlobalInteractionPos(): Point {
        return this.lastGlobalInteractionPos;
    }

    // Static

    public static get instance(): InputManager {
        if (!InputManager._instance) {
            InputManager._instance = new InputManager();
        }

        return InputManager._instance;
    }
}
