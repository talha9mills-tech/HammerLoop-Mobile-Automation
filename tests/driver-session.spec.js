/*************************************************************
 * Test: HammerLoop App Launch
 * Purpose: Verify Appium launches the HammerLoop Android app.
 *************************************************************/

const { remote } = require('webdriverio');

const environment = require('../config/environment');
const { androidCapabilities } = require('../config/capabilities');

describe('HammerLoop App Launch', function () {
    this.timeout(120000);

    let driver;

    before(async function () {
        driver = await remote({
            hostname: environment.appiumHost,
            port: environment.appiumPort,
            path: '/',
            capabilities: androidCapabilities
        });
    });

    after(async function () {
        if (driver) {
            await driver.deleteSession();
        }
    });

    it('should launch the HammerLoop app', async function () {
        const currentPackage = await driver.getCurrentPackage();

        console.log(`Current app package: ${currentPackage}`);

        if (currentPackage !== environment.appPackage) {
            throw new Error(
                `Expected HammerLoop package "${environment.appPackage}" ` +
                `but found "${currentPackage}".`
            );
        }
    });
});c