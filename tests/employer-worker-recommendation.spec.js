/*************************************************************
 * Test: Employer Worker Recommendation
 * Purpose: Verify that an employer can recommend a worker
 *          and subsequently remove the recommendation.
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
    EmployerWorkerRecommendationFlow
} = require('../flows/EmployerWorkerRecommendationFlow');

describe(
    'Employer Worker Recommendation Flow',
    function () {

        this.timeout(180000);

        let driver;

        /* ========================================================= */
        /* Start Appium Session                                       */
        /* ========================================================= */

        before(async function () {

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
        });

        /* ========================================================= */
        /* Close Appium Session                                       */
        /* ========================================================= */

        after(async function () {

            if (driver) {

                await driver.deleteSession();
            }
        });

        /* ========================================================= */
        /* Employer Worker Recommendation Flow                       */
        /* ========================================================= */

        it(
            'should recommend and remove recommendation',

            async function () {

                const employerWorkerRecommendationFlow =
                    new EmployerWorkerRecommendationFlow(
                        driver
                    );

                await employerWorkerRecommendationFlow
                    .recommendAndRemoveWorker();

                console.log(
                    'Employer worker recommendation test completed successfully.'
                );
            }
        );
    }
);