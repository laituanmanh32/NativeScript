/* tslint:disable:no-unused-variable */
import * as app from 'tns-core-modules/application';

import * as TKUnit from '../tk-unit';
import * as commonTests from './application-tests-common';

global.moduleMerge(commonTests, exports);

let androidApp = app.android;
let context = app.android.context;

if (androidApp.foregroundActivity === androidApp.startActivity) {
    ////console.log("We are currently in the main (start) activity of the application");
}
//// Register the broadcast receiver
if (app.android) {
    app.android.registerBroadcastReceiver(android.content.Intent.ACTION_BATTERY_CHANGED,
        function onReceiveCallback(context: android.content.Context, intent: android.content.Intent) {
            let level = intent.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1);
            let scale = intent.getIntExtra(android.os.BatteryManager.EXTRA_SCALE, -1);
            let percent = (level / scale) * 100.0;
            ////console.log("Battery: " + percent + "%");
        });
}
//// When no longer needed, unregister the broadcast receiver
if (app.android) {
    app.android.unregisterBroadcastReceiver(android.content.Intent.ACTION_BATTERY_CHANGED);
}

export let testAndroidApplicationInitialized = function () {
    TKUnit.assert(app.android, "Android application not initialized.");
    TKUnit.assert(app.android.context, "Android context not initialized.");
    TKUnit.assert(app.android.currentContext, "Android currentContext not initialized.");
    TKUnit.assert(app.android.foregroundActivity, "Android foregroundActivity not initialized.");
    TKUnit.assert(app.android.foregroundActivity.isNativeScriptActivity, "Andorid foregroundActivity.isNativeScriptActivity is true");
    TKUnit.assert(app.android.startActivity, "Android startActivity not initialized.");
    TKUnit.assert(app.android.nativeApp, "Android nativeApp not initialized.");
    TKUnit.assert(app.android.packageName, "Android packageName not initialized.");
}
