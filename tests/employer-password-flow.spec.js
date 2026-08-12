/**
 ****************************************************************************************************
 *
 * Test: Employer Password Flow
 * Purpose: Verify employer password change and password reset functionality.
 *
 ****************************************************************************************************
 */

const { remote } =
    require('webdriverio');

const environment =
    require('../config/environment');

const {
    androidCapabilities
} = require('../config/capabilities');

const {
    EmployerPasswordFlow
} = require('../flows/EmployerPasswordFlow');

describe(
    'Employer Password Flow',
    function () {

        this.timeout(600000);

        let driver;

        /* ========================================================= */
        /* Initialize Appium Session                                  */
        /* ========================================================= */

        before(
            async function () {

                driver =
                    await remote({

                        hostname:
                            environment.appiumHost,

                        port:
                            environment.appiumPort,

                        path:
                            '/',

                        capabilities:
                            androidCapabilities
                    });
            }
        );

        /* ========================================================= */
        /* Close Appium Session                                      */
        /* ========================================================= */

        after(
            async function () {

                if (driver) {

                    await driver.deleteSession();
                }
            }
        );

        /* ========================================================= */
        /* Employer Password Flow                                    */
        /* ========================================================= */

        it(
            'should change the employer password and reset it successfully',

            async function () {

                const employerPasswordFlow =
                    new EmployerPasswordFlow(
                        driver
                    );

                await employerPasswordFlow
                    .changeAndResetEmployerPassword();

                console.log(
                    'Employer password change and reset flow completed successfully.'
                );
            }
        );
    }
);