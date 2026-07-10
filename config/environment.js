/*************************************************************
 * Environment Configuration
 * Purpose: Load all project environment variables from .env.
 *************************************************************/

require('dotenv').config();

const environment = {
    appiumHost: process.env.APPIUM_HOST || '127.0.0.1',
    appiumPort: Number(process.env.APPIUM_PORT || 4723),

    androidDeviceName: process.env.ANDROID_DEVICE_NAME || 'Pixel 8',
    androidUdid: process.env.ANDROID_UDID || 'emulator-5554',
    androidPlatformVersion: process.env.ANDROID_PLATFORM_VERSION || '',

    appPackage: process.env.APP_PACKAGE || '',
    appActivity: process.env.APP_ACTIVITY || '',

    testEnvironment: process.env.TEST_ENV || 'staging'
};

module.exports = environment;