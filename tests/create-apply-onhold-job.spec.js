/*************************************************************
 * Test: Employer Creates Job -> Worker Applies -> Employer Moves Application To On Hold
 * Purpose: Verify complete end-to-end job on hold flow.
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
    EmployerOnHoldApplicationFlow
} = require('../flows/EmployerOnHoldApplicationFlow');

describe('Employer Creates Job -> Worker Applies -> Employer Moves Application To On Hold', function () {

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
        'should create a job, allow a worker to apply and move the application to On Hold',

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
            /* Employer moves application to On Hold          */
            /* ============================================== */

            const employerOnHoldApplicationFlow =
                new EmployerOnHoldApplicationFlow(driver);

            await employerOnHoldApplicationFlow
                .moveLatestApplicationToOnHold();
        }
    );
});