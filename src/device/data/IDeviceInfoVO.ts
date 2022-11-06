import { DeviceType } from "./DeviceType";

export interface IDeviceInfoVO {
    deviceType: DeviceType;
    pixelRatio: number;
    isFullScreenApiAvailable: boolean;
}