var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { JSKeyboardEvent, BaseObject } from "@flashist/fcore";
import { FApp, InteractiveEvent } from "../../index";
import { InputManagerEvent } from "./InputManagerEvent";
import { InputManagerEventData } from "./InputManagerEventData";
var InputManager = /** @class */ (function (_super) {
    __extends(InputManager, _super);
    function InputManager() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.apply(this, args) || this;
        _this.pressedKeyCodes = {};
        _this.prevPressedKeyCodes = {};
        _this.justPressedKeyCodes = {};
        _this.justReleasedKeyCodes = {};
        return _this;
    }
    InputManager.prototype.addListeners = function () {
        _super.prototype.addListeners.call(this);
        /*document.addEventListener(JSKeyboardEvent.KEY_DOWN, this.onKeyDown);
         document.addEventListener(JSKeyboardEvent.KEY_UP, this.onKeyUp);*/
        var documentAny = document;
        var documentDispatcher = documentAny;
        this.eventListenerHelper.addEventListener(documentDispatcher, JSKeyboardEvent.KEY_DOWN, this.onKeyDown);
        this.eventListenerHelper.addEventListener(documentDispatcher, JSKeyboardEvent.KEY_PRESS, this.onKeyPress);
        this.eventListenerHelper.addEventListener(documentDispatcher, JSKeyboardEvent.KEY_UP, this.onKeyUp);
        // this.eventListenerHelper.addEventListener(SharedTicker, TickerEvent.TICK, this.onTick);
        this.eventListenerHelper.addEventListener(FApp.instance.stage, InteractiveEvent.DOWN, this.onStageDown);
        this.eventListenerHelper.addEventListener(FApp.instance.stage, InteractiveEvent.UP, this.onStageUp);
        FApp.instance.ticker.add(this.onTick, this);
    };
    InputManager.prototype.removeListeners = function () {
        _super.prototype.removeListeners.call(this);
        FApp.instance.ticker.remove(this.onTick, this);
    };
    InputManager.prototype.onStageUp = function () {
        this.lastGlobalInteractionPos = FApp.instance.getGlobalInteractionPosition();
        this.dispatchEvent(InputManagerEvent.STAGE_UP, this.lastGlobalInteractionPos);
    };
    InputManager.prototype.onStageDown = function () {
        this.lastGlobalInteractionPos = FApp.instance.getGlobalInteractionPosition();
        this.dispatchEvent(InputManagerEvent.STAGE_DOWN, this.lastGlobalInteractionPos);
    };
    InputManager.prototype.onTick = function () {
        this.updateInput();
    };
    InputManager.prototype.onKeyDown = function (event) {
        //CustomLogger.log("InputManager | onKeyDown __ event.event.keyCode: " + event.keyCode);
        if (!this.pressedKeyCodes[event.keyCode]) {
            this.pressedKeyCodes[event.keyCode] = true;
            this.isDataChanged = true;
        }
        var tempData = new InputManagerEventData((event || window.event));
        this.dispatchEvent(InputManagerEvent.KEY_DOWN, tempData);
    };
    InputManager.prototype.onKeyPress = function (event) {
        var tempData = new InputManagerEventData((event || window.event));
        this.dispatchEvent(InputManagerEvent.KEY_PRESS, tempData);
    };
    InputManager.prototype.onKeyUp = function (event) {
        if (this.pressedKeyCodes[event.keyCode]) {
            this.pressedKeyCodes[event.keyCode] = false;
            this.isDataChanged = true;
        }
        var tempData = new InputManagerEventData((event || window.event));
        this.dispatchEvent(InputManagerEvent.KEY_UP, tempData);
    };
    InputManager.prototype.updateInput = function () {
        //CustomLogger.log("InputManager | updateInput __ START");
        //CustomLogger.logCurrentTime();
        if (this.isDataChanged) {
            this.isDataChanged = false;
            var keyCode;
            for (keyCode in this.pressedKeyCodes) {
                if (this.pressedKeyCodes[keyCode] && !this.prevPressedKeyCodes[keyCode]) {
                    this.justPressedKeyCodes[keyCode] = true;
                }
                else {
                    this.justPressedKeyCodes[keyCode] = false;
                }
                if (!this.pressedKeyCodes[keyCode] && this.prevPressedKeyCodes[keyCode]) {
                    this.justReleasedKeyCodes[keyCode] = true;
                }
                else {
                    this.justReleasedKeyCodes[keyCode] = false;
                }
                this.prevPressedKeyCodes[keyCode] = this.pressedKeyCodes[keyCode];
            }
        }
        //CustomLogger.logCurrentTime();
        //CustomLogger.log("InputManager | updateInput __ END");
    };
    InputManager.prototype.checkIfKeyJustPressed = function (keyCode) {
        return this.justPressedKeyCodes[keyCode];
    };
    InputManager.prototype.checkIfKeyJustReleased = function (keyCode) {
        return this.justReleasedKeyCodes[keyCode];
    };
    InputManager.prototype.checkIfKeyDown = function (keyCode) {
        return this.pressedKeyCodes[keyCode];
    };
    InputManager.prototype.getLastGlobalInteractionPos = function () {
        return this.lastGlobalInteractionPos;
    };
    Object.defineProperty(InputManager, "instance", {
        // Static
        get: function () {
            if (!InputManager._instance) {
                InputManager._instance = new InputManager();
            }
            return InputManager._instance;
        },
        enumerable: false,
        configurable: true
    });
    return InputManager;
}(BaseObject));
export { InputManager };
//# sourceMappingURL=InputManager.js.map