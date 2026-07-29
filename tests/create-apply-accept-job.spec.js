/*************************************************************
 * Test: Employer Creates Job -> Worker Applies
 * Purpose: Verify complete end-to-end job application flow.
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

const {
    WorkerJobApplicationFlow
} = require('../flows/WorkerJobApplicationFlow');

const {
    EmployerAcceptApplicationFlow
} = require('../flows/EmployerAcceptApplicationFlow');


describe('Employer Creates Job -> Worker Applies', function () {

    this.timeout(900000);

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
        'should create a job and allow a worker to apply',
        async function () {

            /* ============================================== */
            /* Employer creates a job                         */
            /* ============================================== */

            const createJobFlow =
                new CreateJobFlow(driver);

            await createJobFlow.createJob();

            /* ============================================== */
            /* Reset app session                              */
            /* ============================================== */

            await driver.reloadSession();

            /* ============================================== */
            /* Worker logs in and applies                     */
            /* ============================================== */

            const workerJobApplicationFlow =
                new WorkerJobApplicationFlow(driver);

            await workerJobApplicationFlow
                .applyForLatestJob();

            /* ============================================== */
            /* Reset app session                              */
            /* ============================================== */

            await driver.reloadSession();

            /* ============================================== */
            /* Employer accepts application                   */
            /* ============================================== */

            const employerAcceptApplicationFlow =
                new EmployerAcceptApplicationFlow(driver);

            await employerAcceptApplicationFlow
                .acceptLatestApplication();
        }
    );
});