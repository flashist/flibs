import { ServiceLocator } from "./ServiceLocator";

// Shortcuts
export const getInstance: typeof ServiceLocator.getInstance = ServiceLocator.getInstance;
export const serviceLocatorAdd: typeof ServiceLocator.add = ServiceLocator.add;
export const serviceLocatorProcessItemOnActivate: typeof ServiceLocator.processItemOnActivate = ServiceLocator.processItemOnActivate;
export const serviceLocatorProcessItemOnDeactivate: typeof ServiceLocator.processItemOnDeactivate = ServiceLocator.processItemOnDeactivate;

//
window["getInstance"] = getInstance;