/*************************************************************
 * Test: Worker Signup
 * Purpose: Create and verify a new Worker account.
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

    it(
        'should create and verify a Worker account',
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