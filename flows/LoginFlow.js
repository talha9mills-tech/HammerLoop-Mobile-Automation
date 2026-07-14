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

class LoginFlow {

    constructor(driver) {

        this.driver = driver;

        this.loginPage =
            new LoginPage(driver);

        this.employerDashboardPage =
            new EmployerDashboardPage(driver);
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

    async loginWorker(
        email,
        password,
        workerDashboardPage
    ) {

        await this.login(
            email,
            password
        );

        await workerDashboardPage
            .verifyDashboardLoaded();

        console.log(
            'Worker logged in successfully.'
        );
    }
}

module.exports = {
    LoginFlow
};