/*************************************************************
 * Test: Worker Signup + Complete Profile
 * Purpose: Create a Worker account and complete onboarding.
 *************************************************************/

const { remote } = require('webdriverio');

const environment =
    require('../config/environment');

const {
    androidCapabilities
} = require('../config/capabilities');

const {
    createUser
} = require('../data/factories/userFactory');

const {
    WorkerSignupFlow
} = require('../flows/WorkerSignupFlow');

describe('Worker Signup', function () {

    this.timeout(180000);

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
        'should create a Worker account and complete onboarding',

        async function () {

            const workerUser =
                createUser('Worker');

            console.log(
                `Creating Worker account: ${workerUser.email}`
            );

            const workerSignupFlow =
                new WorkerSignupFlow(driver);

            await workerSignupFlow.createWorkerAccount(
                workerUser
            );
        }
    );
});