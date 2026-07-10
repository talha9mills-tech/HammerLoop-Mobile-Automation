/*************************************************************
 * Appium Capabilities
 * Purpose: Define the Android HammerLoop test session.
 *************************************************************/

const environment = require('./environment');

const androidCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': environment.androidDeviceName,
    'appium:udid': environment.androidUdid,

    'appium:appPackage': environment.appPackage,
    'appium:appActivity': environment.appActivity,

    'appium:autoGrantPermissions': true,

    // Clear HammerLoop app data before every new Appium session.
    // This makes each signup test start as a first-time user.
    'appium:noReset': false,

    // Do not uninstall HammerLoop from the emulator.
    'appium:fullReset': false,

    'appium:newCommandTimeout': 120
};

if (environment.androidPlatformVersion) {
    androidCapabilities['appium:platformVersion'] =
        environment.androidPlatformVersion;
}

module.exports = {
    androidCapabilities
};