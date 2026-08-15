/*************************************************************
 * Flow: Employer On Hold Application Flow
 * Purpose: Login as Employer and move the latest
 * worker application to On Hold.
 *************************************************************/

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    LoginFlow
} = require('./LoginFlow');

const {
    EmployerDashboardPage
} = require('../pages/EmployerDashboardPage');

const {
    EmployerNotificationsPage
} = require('../pages/EmployerNotificationsPage');

const {
    getLatestCreatedJob
} = require('../utils/jobRegistry');

class EmployerOnHoldApplicationFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.loginFlow =
            new LoginFlow(driver);

        this.employerDashboardPage =
            new EmployerDashboardPage(driver);

        this.employerNotificationsPage =
            new EmployerNotificationsPage(driver);
    }

    /* ========================================================= */
    /* Move Latest Job Application To On Hold                    */
    /* ========================================================= */

    async moveLatestApplicationToOnHold() {

        /* ===================================================== */
        /* STEP 1 - Open Login Screen                            */
        /* ===================================================== */

        await this.welcomePage
            .tapGetStarted();

        /* ===================================================== */
        /* STEP 2 - Login as Employer                            */
        /* ===================================================== */

        await this.loginFlow
            .loginEmployer();

        /* ===================================================== */
        /* STEP 3 - Verify Employer Dashboard                    */
        /* ===================================================== */

        await this.employerDashboardPage
            .verifyDashboardLoaded();

        /* ===================================================== */
        /* STEP 4 - Open Notifications                           */
        /* ===================================================== */

        await this.employerNotificationsPage
            .tapNotificationBell();

        /* ===================================================== */
        /* STEP 5 - Read Latest Created Job                      */
        /* ===================================================== */

        const job =
            getLatestCreatedJob();

        console.log(
            `Opening notification for "${job.title}".`
        );

        /* ===================================================== */
        /* STEP 6 - Open Correct Notification                    */
        /* ===================================================== */

        await this.employerNotificationsPage
            .openJobApplicationNotification(
                job.title
            );

        /* ===================================================== */
        /* STEP 7 - Verify Job Title                             */
        /* ===================================================== */

        await this.employerNotificationsPage
            .verifyJobTitle(
                job.title
            );

        /* ===================================================== */
        /* STEP 8 - Verify Applicant                             */
        /* ===================================================== */

        await this.employerNotificationsPage
            .verifyApplicant(
                'Levi Reed'
            );

        /* ===================================================== */
        /* STEP 9 - Move Applicant To On Hold                    */
        /* ===================================================== */

        await this.employerNotificationsPage
            .tapOnHold(
                'Levi Reed'
            );
    }
}

module.exports = {
    EmployerOnHoldApplicationFlow
};