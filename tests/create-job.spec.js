/*************************************************************
 * Test: Employer Create Job
 * Purpose: Login as Employer and create a new Job.
 *************************************************************/

const { remote } = require('webdriverio');

const environment =
    require('../config/environment');

const {
    androidCapabilities
} = require('../config/capabilities');

const {
    CreateJobFlow
} = require('../flows/CreateJobFlow');

describe('Employer Create Job', function () {

    this.timeout(300000);

    let driver;

    before(async function () {

        driver = await remote({

            hostname:
                environment.appiumHost,

            port:
                environment.appiumPort,

            path:
                '/',

            capabilities:
                androidCapabilities
        });
    });

    after(async function () {

        if (driver) {

            await driver.deleteSession();
        }
    });

    it(
        'should login as Employer and create a new Job',

        async function () {

            const createJobFlow =
                new CreateJobFlow(driver);

            await createJobFlow.createJob();

            await driver.pause(1000);
        }
    );
});