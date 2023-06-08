import { DeviceType } from "./DeviceType";
import { OSType } from "./OSType";

export interface IDeviceInfoVO {
    deviceType: DeviceType;
    osType: OSType;
    pixelRatio: number;
    isFullScreenApiAvailable: boolean;
    mainLocale: string;
    languages: string[];
}