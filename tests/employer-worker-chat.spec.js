/*************************************************************
 * Test: Employer Worker Chat
 * Purpose: Verify that an employer can find a worker,
 *          hire the worker, open the chat, send a message,
 *          and verify that the message was sent successfully.
 *************************************************************/

const {
    remote
} = require('webdriverio');

const environment =
    require('../config/environment');

const {
    androidCapabilities
} = require('../config/capabilities');

const {
    EmployerWorkerChatFlow
} = require('../flows/EmployerWorkerChatFlow');


describe(
    'Employer Worker Chat',
    function () {

        this.timeout(180000);

        let driver;


        /* ========================================================= */
        /* Create Appium Session                                      */
        /* ========================================================= */

        before(
            async function () {

                console.log(
                    'Starting Appium session...'
                );

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

                console.log(
                    'Appium session started successfully.'
                );
            }
        );


        /* ========================================================= */
        /* Delete Appium Session                                     */
        /* ========================================================= */

        after(
            async function () {

                if (driver) {

                    console.log(
                        'Closing Appium session...'
                    );

                    await driver.deleteSession();

                    console.log(
                        'Appium session closed successfully.'
                    );
                }
            }
        );


        /* ========================================================= */
        /* Employer Worker Chat Test                                 */
        /* ========================================================= */

        it(
            'should allow employer to hire a worker and send a chat message',
            async function () {

                console.log(
                    'Starting Employer Worker Chat test...'
                );

                const employerWorkerChatFlow =
                    new EmployerWorkerChatFlow(
                        driver
                    );

                await employerWorkerChatFlow
                    .sendEmployerChatMessage();

                console.log(
                    'Employer Worker Chat test completed successfully.'
                );
            }
        );
    }
);