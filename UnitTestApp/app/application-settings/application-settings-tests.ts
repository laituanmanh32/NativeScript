import * as TKUnit from '../tk-unit';

let appSettings = require("tns-core-modules/application-settings");
let stringKey: string = "stringKey";
let boolKey: string = "boolKey";
let numberKey: string = "numberKey";
let noStringKey: string = "noStringKey";
let noBoolKey: string = "noBoolKey";
let noNumberKey: string = "noNumberKey";

export let testBoolean = function () {
    appSettings.setBoolean(boolKey, false);
    let boolValueBefore = appSettings.getBoolean(boolKey);
    TKUnit.assert(false === boolValueBefore, "Cannot set boolean to false, currently it is: " + appSettings.getBoolean(boolKey));

    appSettings.setBoolean("boolKey", true);
    let boolValue = appSettings.getBoolean("boolKey", false);

    TKUnit.assert(true === boolValue, "Cannot set boolean to true");

    TKUnit.assert(true === appSettings.getBoolean(boolKey), "Cannot set boolean to true (no default)");
};

export let testString = function () {
    appSettings.setString("stringKey", "String value");
    let stringValue = appSettings.getString("stringKey");

    TKUnit.assert("String value" === stringValue, "Cannot set string value");
};

export let testNumber = function () {
    appSettings.setNumber("numberKey", 54.321);
    let value = parseFloat(appSettings.getNumber("numberKey").toFixed(3));

    TKUnit.assert(54.321 === value, "Cannot set number value 54.321 != " + value);
};

export let testDefaults = function () {
    let defaultValue = appSettings.getString("noStringKey", "No string value");
    // will return "No string value" if there is no value for "noStringKey"

    TKUnit.assert("No string value" === defaultValue, "Bad default string value");
    TKUnit.assert(true === appSettings.getBoolean(noBoolKey, true), "Bad default boolean value");
    TKUnit.assert(123.45 === appSettings.getNumber(noNumberKey, 123.45), "Bad default number value");
}

export let testDefaultsWithNoDefaultValueProvided = function () {
    let defaultValue = appSettings.getString("noStringKey");
    // will return undefined if there is no value for "noStringKey"

    TKUnit.assertEqual(defaultValue, undefined, "Default string value is not undefined");

    TKUnit.assertEqual(appSettings.getBoolean(noBoolKey), undefined, "Default boolean value is not undefined");
    TKUnit.assertEqual(appSettings.getNumber(noNumberKey), undefined, "Default number value is not undefined");
};

export let testHasKey = function () {
    let hasKey = appSettings.hasKey("noBoolKey");
    // will return false if there is no value for "noBoolKey"

    TKUnit.assert(!hasKey, "There is a key: " + noBoolKey);
    TKUnit.assert(!appSettings.hasKey(noStringKey), "There is a key: " + noStringKey);
    TKUnit.assert(!appSettings.hasKey(noNumberKey), "There is a key: " + noNumberKey);

    TKUnit.assert(appSettings.hasKey(boolKey), "There is no key: " + boolKey);
    TKUnit.assert(appSettings.hasKey(stringKey), "There is no key: " + stringKey);
    TKUnit.assert(appSettings.hasKey(numberKey), "There is no key: " + numberKey);
};

export let testRemove = function () {
    appSettings.remove("boolKey");

    TKUnit.assert(!appSettings.hasKey(boolKey), "Failed to remove key: " + boolKey);

    appSettings.remove(stringKey);
    TKUnit.assert(!appSettings.hasKey(stringKey), "Failed to remove key: " + stringKey);

    appSettings.remove(numberKey);
    TKUnit.assert(!appSettings.hasKey(numberKey), "Failed to remove key: " + numberKey);
};

export let testClear = function () {
    appSettings.clear();

    TKUnit.assert(!appSettings.hasKey(boolKey), "Failed to remove key: " + boolKey);
    TKUnit.assert(!appSettings.hasKey(stringKey), "Failed to remove key: " + stringKey);
    TKUnit.assert(!appSettings.hasKey(numberKey), "Failed to remove key: " + numberKey);
};

export let testFlush = function () {
    appSettings.setString(stringKey, "String value");

    let flushed = appSettings.flush();
    // will return boolean indicating whether flush to disk was successful

    TKUnit.assert(flushed, "Flush failed: " + flushed);
    TKUnit.assert(appSettings.hasKey(stringKey), "There is no key: " + stringKey);
};

export let testAllKeys = function () {
    appSettings.setString(stringKey, "String value");
    appSettings.setBoolean(boolKey, true);
    appSettings.setNumber(numberKey, 22);

    let allKeys = appSettings.getAllKeys();
    TKUnit.assert(allKeys.indexOf(stringKey) !== -1, `${stringKey} is missing from .allKeys()`);
    TKUnit.assert(allKeys.indexOf(boolKey) !== -1, `${boolKey} is missing from .allKeys()`);
    TKUnit.assert(allKeys.indexOf(numberKey) !== -1, `${numberKey} is missing from .allKeys()`);
}

export let testInvalidKey = function () {
    try {
        appSettings.hasKey(undefined);
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.hasKey(null);
        TKUnit.assert(false, "There is a key null");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.hasKey(123);
        TKUnit.assert(false, "There is a key number");
    }
    catch (e) {
        // we should receive an exception here
    }

    appSettings.hasKey("string");
};

export let testInvalidValue = function () {
    try {
        appSettings.setBoolean(boolKey, "str");
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.setBoolean(boolKey, 123);
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.setString(boolKey, true);
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.setString(boolKey, 123);
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.setNumber(boolKey, true);
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

    try {
        appSettings.setNumber(boolKey, "123");
        TKUnit.assert(false, "There is a key undefined");
    }
    catch (e) {
        // we should receive an exception here
    }

};
