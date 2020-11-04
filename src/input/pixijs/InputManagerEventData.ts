export class InputManagerEventData {
    public nativeEvent: any;
    public nativeKeyboardEvent: KeyboardEvent;

    constructor(nativeEvent: any) {
        this.nativeEvent = nativeEvent;
    }
}
