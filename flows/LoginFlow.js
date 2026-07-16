/*************************************************************
 * Flow: Login Flow
 * Purpose: Login as an existing HammerLoop user.
 *************************************************************/

const environment =
    require('../config/environment');

const {
    LoginPage
} = require('../pages/LoginPage');

const {
    EmployerDashboardPage
} = require('../pages/EmployerDashboardPage');

const {
    WorkerDashboardPage
} = require('../pages/WorkerDashboardPage');

class LoginFlow {

    constructor(driver) {

        this.driver = driver;

        this.loginPage =
            new LoginPage(driver);

        this.employerDashboardPage =
            new EmployerDashboardPage(driver);

        this.workerDashboardPage =
            new WorkerDashboardPage(driver);
    }

    /* ========================================================= */
    /* Generic Login                                             */
    /* ========================================================= */

    async login(
        email,
        password
    ) {

        console.log(
            `Logging in with ${email}...`
        );

        await this.loginPage
            .enterEmail(email);

        await this.loginPage
            .enterPassword(password);

        await this.loginPage
            .tapSignIn();
    }

    /* ========================================================= */
    /* Login as Employer                                         */
    /* ========================================================= */

    async loginEmployer() {

        await this.login(
            environment.employerEmail,
            environment.employerPassword
        );

        await this.employerDashboardPage
            .verifyDashboardLoaded();

        console.log(
            'Employer logged in successfully.'
        );
    }

    /* ========================================================= */
    /* Login as Worker                                           */
    /* ========================================================= */

    async loginWorker() {

        await this.login(
            environment.workerEmail,
            environment.workerPassword
        );

        await this.workerDashboardPage
            .verifyDashboardLoaded();

        console.log(
            'Worker logged in successfully.'
        );
    }
}

module.exports = {
    LoginFlow
};