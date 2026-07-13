/*************************************************************
 * Test: Employer Signup
 * Purpose: Create, verify and onboard a new Employer.
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
    SignUpFlow
} = require('../flows/SignUpFlow');

describe('Employer Signup', function () {

    this.timeout(180000);

    let driver;

    before(async function () {

        driver = await remote({

            hostname:
                environment.appiumHost,

            port:
                environment.appiumPort,

            path: '/',

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
        'should create, verify and onboard an Employer',
        async function () {

            const employerUser =
                createUser(
                    'Employer'
                );

            console.log(
                `Creating Employer account: ${employerUser.email}`
            );

            const signUpFlow =
                new SignUpFlow(
                    driver
                );

            await signUpFlow.createAccount(
                employerUser,
                'Employer'
            );
        }
    );
});