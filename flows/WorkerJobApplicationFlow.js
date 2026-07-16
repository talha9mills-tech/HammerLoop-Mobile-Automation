/*************************************************************
 * Flow: Worker Job Application Flow
 * Purpose: Login as Worker and apply for the latest created job.
 *************************************************************/

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    LoginFlow
} = require('./LoginFlow');

const {
    WorkerDashboardPage
} = require('../pages/WorkerDashboardPage');

const {
    FindJobsPage
} = require('../pages/FindJobsPage');

const {
    JobDetailsPage
} = require('../pages/JobDetailsPage');

const {
    getLatestCreatedJob
} = require('../utils/jobRegistry');

class WorkerJobApplicationFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.loginFlow =
            new LoginFlow(driver);

        this.workerDashboardPage =
            new WorkerDashboardPage(driver);

        this.findJobsPage =
            new FindJobsPage(driver);

        this.jobDetailsPage =
            new JobDetailsPage(driver);
    }

    /* ========================================================= */
    /* Apply For Latest Created Job                              */
    /* ========================================================= */

    async applyForLatestJob() {

        /* ===================================================== */
        /* STEP 1: Open Login Screen                             */
        /* ===================================================== */

        await this.welcomePage
            .tapGetStarted();

        /* ===================================================== */
        /* STEP 2: Login as Worker                               */
        /* ===================================================== */

        await this.loginFlow
            .loginWorker();

        /* ===================================================== */
        /* STEP 3: Open Find Jobs                                */
        /* ===================================================== */

        await this.workerDashboardPage
            .startFindJob();

        /* ===================================================== */
        /* STEP 4: Read Latest Created Job                       */
        /* ===================================================== */

        const job =
            getLatestCreatedJob();

        console.log(
            `Searching job: ${job.title}`
        );

        /* ===================================================== */
        /* STEP 5: Search Job                                    */
        /* ===================================================== */

        await this.findJobsPage
            .searchJob(job.title);

        /* ===================================================== */
        /* STEP 6: Verify First Matching Job                     */
        /* ===================================================== */

        await this.findJobsPage
            .verifyFirstJobCard(
                job.title,
                'Western Build Partners'
            );

        /* ===================================================== */
        /* STEP 7: Apply                                         */
        /* ===================================================== */

        await this.findJobsPage
            .tapApply();

        /* ===================================================== */
        /* STEP 8: Verify Job Details                            */
        /* ===================================================== */

        await this.jobDetailsPage
            .verifyJobTitle(job.title);

        /* ===================================================== */
        /* STEP 9: Loop Me In                                    */
        /* ===================================================== */

        await this.jobDetailsPage
            .tapLoopMeIn();

        /* ===================================================== */
        /* STEP 10: Verify Success Modal                         */
        /* ===================================================== */

        await this.jobDetailsPage
            .verifyApplicationSubmitted();

        /* ===================================================== */
        /* STEP 11: Continue                                     */
        /* ===================================================== */

        await this.jobDetailsPage
            .tapContinue();

        console.log(
            'Worker applied for job successfully.'
        );

        await this.driver.pause(2000);
    }
}

module.exports = {
    WorkerJobApplicationFlow
};