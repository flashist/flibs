export interface IFullscreenNativeAPI {
    requestFullscreen: (options?: any) => void;
    exitFullscreen: () => void;
    fullscreenElement: Element;
    fullscreenEnabled: boolean;
    fullscreenchange: (event: any) => void;
    fullscreenerror: (event: any) => void;
}