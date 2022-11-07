import { IFullscreenNativeAPI } from "./IFullscreenNativeAPI";

export class DeviceFullscreenTools {

    private static methodMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror',
        ],
        // New WebKit
        [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror',

        ],
        // Old WebKit
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror',

        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror',
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError',
        ],
    ];

    // API prepared with correct prefixes
    private static nativeAPI: { [nativeApiKey: string]: string } = (() => {
        if (typeof document === 'undefined') {
            return false;
        }

        const unprefixedMethods = DeviceFullscreenTools.methodMap[0];
        const returnValue = {};

        for (const methodList of DeviceFullscreenTools.methodMap) {
            const exitFullscreenMethod = methodList?.[1];
            if (exitFullscreenMethod in document) {
                // for (const [index, method] of methodList.entries()) {
                //     returnValue[unprefixedMethods[index]] = method;
                // }
                const methodsCount: number = methodList.length;
                for (let methodIndex: number = 0; methodIndex < methodsCount; methodIndex++) {
                    returnValue[unprefixedMethods[methodIndex]] = methodList[methodIndex];
                }

                return returnValue;
            }
        }

        return false;
    })();

    private static eventNameMap = {
        change: DeviceFullscreenTools.nativeAPI.fullscreenchange,
        error: DeviceFullscreenTools.nativeAPI.fullscreenerror,
    };


    // eslint-disable-next-line default-param-last
    static request(element: Element = document.documentElement, options?: any) {
        return new Promise<void>((resolve, reject) => {
            const onFullScreenEntered = () => {
                DeviceFullscreenTools.off('change', onFullScreenEntered);
                resolve();
            };

            DeviceFullscreenTools.on('change', onFullScreenEntered);

            const returnPromise = element[DeviceFullscreenTools.nativeAPI.requestFullscreen](options);
            if (returnPromise instanceof Promise) {
                returnPromise.then(onFullScreenEntered).catch(reject);
            }
        });
    }

    static exit() {
        return new Promise<void>((resolve, reject) => {
            if (!DeviceFullscreenTools.isFullscreen) {
                resolve();
                return;
            }

            const onFullScreenExit = () => {
                DeviceFullscreenTools.off('change', onFullScreenExit);
                resolve();
            };

            DeviceFullscreenTools.on('change', onFullScreenExit);

            const returnPromise = document[DeviceFullscreenTools.nativeAPI.exitFullscreen]();
            if (returnPromise instanceof Promise) {
                returnPromise.then(onFullScreenExit).catch(reject);
            }
        });
    }

    static toggle(element: Element = document.documentElement, options?: any) {
        return DeviceFullscreenTools.isFullscreen ? DeviceFullscreenTools.exit() : DeviceFullscreenTools.request(element, options);
    }

    static onchange(callback) {
        DeviceFullscreenTools.on('change', callback);
    }

    static onerror(callback) {
        DeviceFullscreenTools.on('error', callback);
    }

    private static on(event: string, callback) {
        const eventName = DeviceFullscreenTools.eventNameMap[event];
        if (eventName) {
            document.addEventListener(eventName, callback, false);
        }
    }

    private static off(event: string, callback) {
        const eventName = DeviceFullscreenTools.eventNameMap[event];
        if (eventName) {
            document.removeEventListener(eventName, callback, false);
        }
    }

    // eslint-disable-next-line import/no-mutable-exports
    // const  fullscreenHelper = {

    //     raw: nativeAPI,
    // };

    static get isFullscreen(): boolean {
        return document[DeviceFullscreenTools.nativeAPI.fullscreenElement];
    }

    static get element(): Element {
        return document[DeviceFullscreenTools.nativeAPI.fullscreenElement] ?? undefined;
    }

    static get isEnabled(): boolean {
        return !!document[DeviceFullscreenTools.nativeAPI.fullscreenEnabled];
    }

    // if(!nativeAPI) {
    //     fullscreenHelper = { isEnabled: false };
    // }


}