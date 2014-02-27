/*global getNewInstance*/
/**
 * Simple Dependency Injector for module pattern modules. For instance creation it just executes the constructor
 * @module Dependency Injector
 */
var di = (function () {
    var modules = {};

    /**
     * Register a new module using its constructor
     * @memberOf module:Dependency Injector
     * @param moduleName {string} modules name
     * @param moduleConstructor {function} modules constructor
     * @param dependencies {string[]} dependent module names
     */
    function register(moduleName, moduleConstructor, dependencies) {
        modules[moduleName] = {
            constructor: moduleConstructor,
            dependencies: dependencies
        };
    }

    function getModule(moduleName) {
        var module = modules[moduleName];
        if (module) {
            return module;
        }
        throw new Error("Module[" + moduleName + "] is not registered");
    }

    /**
     * Returns asked registered module constructor
     * @memberOf module:Dependency Injector
     * @param moduleName {string} module name
     * @returns {function} modules constructor
     */
    function getConstructor(moduleName) {
        var constructor = getModule(moduleName).constructor;
        if (constructor) {
            return constructor;
        }
        throw new Error("Constructor for module[" + moduleName + "] is not registered");
    }

    /**
     * Resets own state to initial. Forgets every registered module. Useful for testing.
     * @memberOf module:Dependency Injector
     */
    function reset() {
        modules = {};
    }

    /**
     * Return an instance of asked module. If it is asked first time, it will create new instance and return in. If it was asked before, it will return the previous one
     * @memberOf module:Dependency Injector
     * @param moduleName {string} module name
     * @returns {object} module instance
     */
    function getInstance(moduleName) {
        var module = getModule(moduleName);
        if (module.instance) {
            return module.instance;
        }
        module.instance = getNewInstance(moduleName);
        return module.instance;
    }

    function resolveDependencies(moduleName) {
        var i,
            moduleDependencies = getModule(moduleName).dependencies,
            instances = [],
            length = moduleDependencies ? moduleDependencies.length : 0;

        for (i = 0; i < length; i += 1) {
            instances.push(getInstance(moduleDependencies[i]));
        }

        return instances;
    }

    /**
     * Return a new instance of asked module. It always creates a new instance.
     * @memberOf module:Dependency Injector
     * @param moduleName {string} module name
     * @param dependency {...*} module dependencies (instances). For manual dependency resolving. Used in tests.
     * @returns {object} module instance
     */
    function getNewInstance(moduleName) {
        var params,
            constructor = getConstructor(moduleName);
        Array.prototype.splice.call(arguments, 0, 1);
        params = arguments;
        if (constructor) {
            if (params.length > 0) { //manual resolving. Used in tests
                return constructor.apply(this, params);
            }
            return constructor.apply(this, resolveDependencies(moduleName));
        }
    }

    return {
        register: register,
        getConstructor: getConstructor,
        reset: reset,
        getInstance: getInstance,
        getNewInstance: getNewInstance
    };
}());