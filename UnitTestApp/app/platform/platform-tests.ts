import * as app from 'tns-core-modules/application';
import * as platformModule from 'tns-core-modules/platform';

import * as TKUnit from '../tk-unit';

export function test_setTimeout_isDefined() {
    let expected;
    if (app.android) {
        expected = "Android";
    }
    else {
        expected = "iOS";
    }
    TKUnit.assertEqual(platformModule.device.os, expected, "device.os");
};

export function snippet_print_all() {
    console.log("Device model: " + platformModule.device.model);
    console.log("Device type: " + platformModule.device.deviceType);
    console.log("Device manufacturer: " + platformModule.device.manufacturer);
    console.log("Preferred language: " + platformModule.device.language);
    console.log("Preferred region: " + platformModule.device.region);
    console.log("OS: " + platformModule.device.os);
    console.log("OS version: " + platformModule.device.osVersion);
    console.log("SDK version: " + platformModule.device.sdkVersion);
    console.log("Device UUID: " + platformModule.device.uuid);

    console.log("Screen width (px): " + platformModule.screen.mainScreen.widthPixels);
    console.log("Screen height (px): " + platformModule.screen.mainScreen.heightPixels);
    console.log("Screen width (DIPs): " + platformModule.screen.mainScreen.widthDIPs);
    console.log("Screen height (DIPs): " + platformModule.screen.mainScreen.heightDIPs);
    console.log("Screen scale: " + platformModule.screen.mainScreen.scale);
};

export function testIsIOSandIsAndroid() {
    if (platformModule.isIOS) {
        TKUnit.assertTrue(!!NSObject, "isIOS is true-ish but common iOS APIs are not available.");
    } else if (platformModule.isAndroid) {
        TKUnit.assertTrue(!!android, "isAndroid is true but common 'android' package is not available.");
    }
}
