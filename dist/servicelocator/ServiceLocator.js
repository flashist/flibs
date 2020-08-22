var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Dictionary, ObjectTools } from "fcore";
var ServiceLocator = /** @class */ (function () {
    function ServiceLocator() {
    }
    ServiceLocator.activate = function () {
        var tempInjection;
        var keys = ServiceLocator.injectionsMap.getKeys();
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var prop = keys_1[_i];
            tempInjection = ServiceLocator.injectionsMap.getItem(prop);
            if (tempInjection.config) {
                if (tempInjection.config.forceCreation) {
                    ServiceLocator.getInstance(tempInjection.item);
                }
            }
        }
    };
    ServiceLocator.add = function (item, config) {
        var _a;
        var tempInjection = ServiceLocator.getInjection(item);
        if (config) {
            if (config.toSubstitute) {
                tempInjection.toSubstitute = config.toSubstitute;
                var toSubstituteInjection = ServiceLocator.getInjection(tempInjection.toSubstitute);
                toSubstituteInjection.substitution = item;
                if (toSubstituteInjection.config) {
                    if (!config.activateeConstructors) {
                        config.activateeConstructors = [];
                    }
                    if (toSubstituteInjection.config.activateeConstructors) {
                        (_a = config.activateeConstructors).push.apply(_a, toSubstituteInjection.config.activateeConstructors);
                    }
                    // Copy properties TO THE FINAL substitution from the injection which will be substituted
                    ObjectTools.copyProps(config, toSubstituteInjection.config, {
                        ignoreExistedProperties: true
                    });
                }
            }
        }
        else {
            config = {};
        }
        tempInjection.config = config;
        /*if (config) {
            tempInjection.config = config;

        } else {
            if (config.toSubstitute) {
                let toSubstituteInjection: IInjection = ServiceLocator.getInjection(tempInjection.toSubstitute);

                // If there is no config for the item, but there is a config for the item which should be substituted,
                // then use the item-to-be-substituted config.
                if (toSubstituteInjection.config) {
                    tempInjection.config = toSubstituteInjection.config;
                }
            }
        }*/
    };
    ServiceLocator.getInstance = function (item) {
        var _a, _b;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var result;
        var tempInjection = ServiceLocator.getInjection(item);
        var constructionArgs;
        if (tempInjection.config) {
            constructionArgs;
        }
        if (tempInjection.config && tempInjection.config.isSingleton) {
            if (!tempInjection.singletonInstance) {
                tempInjection.singletonInstance = new ((_a = tempInjection.item).bind.apply(_a, __spreadArrays([void 0], tempInjection.config.constructionArgs)))();
            }
            result = tempInjection.singletonInstance;
        }
        else {
            result = new ((_b = tempInjection.item).bind.apply(_b, __spreadArrays([void 0], args)))();
        }
        if (ServiceLocator.options.debug) {
            var constructorName = ServiceLocator.getConstructorName(item);
            window[constructorName] = result;
        }
        return result;
    };
    ServiceLocator.getInjection = function (item) {
        // Create if not created yet
        if (!ServiceLocator.injectionsMap.getItem(item)) {
            ServiceLocator.injectionsMap.addItem(item, {
                item: item
            });
        }
        var result = ServiceLocator.injectionsMap.getItem(item);
        if (result.substitution) {
            result = ServiceLocator.getInjection(result.substitution);
        }
        return result;
    };
    ServiceLocator.processItemOnActivate = function (item) {
        if (!item.constructor) {
            return;
        }
        var tempInjection = ServiceLocator.getInjection(item.constructor);
        var activateesConstructors = ServiceLocator.getChainActivateesConstructors(tempInjection);
        if (activateesConstructors && activateesConstructors.length > 0) {
            var activateesList = ServiceLocator.activatorToActivateesMap.getItem(item);
            if (!activateesList) {
                activateesList = [];
                ServiceLocator.activatorToActivateesMap.addItem(item, activateesList);
            }
            var activateesCount = activateesConstructors.length;
            for (var activateeIndex = 0; activateeIndex < activateesCount; activateeIndex++) {
                var TempActivateeClass = activateesConstructors[activateeIndex];
                var tempActivatee = ServiceLocator.getInstance(TempActivateeClass);
                tempActivatee.onActivatorStart(item);
                activateesList.push(tempActivatee);
            }
        }
    };
    ServiceLocator.processItemOnDeactivate = function (item) {
        var activateesList = ServiceLocator.activatorToActivateesMap.getItem(item);
        if (!activateesList) {
            return;
        }
        var activateesCount = activateesList.length;
        for (var activateeIndex = 0; activateeIndex < activateesCount; activateeIndex++) {
            var tempActivatee = activateesList[activateeIndex];
            tempActivatee.onActivatorEnd();
        }
        // Clear information about activator-to-activatee map
        ServiceLocator.activatorToActivateesMap.removeItemByKey(item);
    };
    ServiceLocator.getChainActivateesConstructors = function (item) {
        var result = [];
        if (item.config) {
            // Do while there is no information about the constructor,
            // which should be created on activation
            // and while there is an object in the substitue chain, which might have such information
            // while (item.config.activateesConstructors) {
            if (item.config.activateeConstructors) {
                result.push.apply(result, item.config.activateeConstructors);
            }
            /*if (item.toSubstitute) {
                item = ServiceLocator.getInjection(item.toSubstitute);
            } else {
                break;
            }*/
            // }
        }
        return result;
    };
    ServiceLocator.getConstructorName = function (constructor) {
        var result = ObjectTools.getConstructorName(constructor);
        if (!result) {
            var startText = "class ";
            var startIndex = constructor.toString().indexOf(startText) + startText.length;
            var endText = " extends";
            var endIndex = constructor.toString().indexOf(endText);
            result = constructor.toString().slice(startIndex, endIndex);
        }
        return result;
    };
    ServiceLocator.options = {};
    ServiceLocator.injectionsMap = new Dictionary();
    ServiceLocator.activatorToActivateesMap = new Dictionary();
    return ServiceLocator;
}());
export { ServiceLocator };
// Shortcuts
export var getInstance = ServiceLocator.getInstance;
export var serviceLocatorAdd = ServiceLocator.add;
export var serviceLocatorProcessItemOnActivate = ServiceLocator.processItemOnActivate;
export var serviceLocatorProcessItemOnDeactivate = ServiceLocator.processItemOnDeactivate;
//# sourceMappingURL=ServiceLocator.js.map