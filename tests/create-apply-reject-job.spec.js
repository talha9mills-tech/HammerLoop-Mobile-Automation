/*************************************************************
 * Test: Employer Creates Job -> Worker Applies -> Employer Rejects
 * Purpose: Verify complete end-to-end job rejection flow.
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
    EmployerRejectApplicationFlow
} = require('../flows/EmployerRejectApplicationFlow');

describe('Employer Creates Job -> Worker Applies -> Employer Rejects', function () {

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
        'should create a job, allow a worker to apply and reject the application',

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
            /* Employer rejects application                   */
            /* ============================================== */

            const employerRejectApplicationFlow =
                new EmployerRejectApplicationFlow(driver);

            await employerRejectApplicationFlow
                .rejectLatestApplication();
        }
    );
});