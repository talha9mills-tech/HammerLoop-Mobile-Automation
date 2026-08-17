/*************************************************************
 * Flow: Employer Worker Recommendation Flow
 * Purpose: Login as employer, find a worker, hire the
 *          worker, recommend the worker, and remove the
 *          recommendation.
 *************************************************************/

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    LoginFlow
} = require('./LoginFlow');

const {
    FindWorkerPage
} = require('../pages/FindWorkerPage');

class EmployerWorkerRecommendationFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.loginFlow =
            new LoginFlow(driver);

        this.findWorkerPage =
            new FindWorkerPage(driver);
    }

    /* ========================================================= */
    /* Complete Employer Worker Recommendation Flow              */
    /* ========================================================= */

    async recommendAndRemoveWorker() {

        console.log(
            'Starting employer worker recommendation flow...'
        );

        /* ========================================================= */
        /* Worker To Search For                                      */
        /* ========================================================= */

        const workerName =
            'Julian Rogers';

        /* ========================================================= */
        /* Get Started                                               */
        /* ========================================================= */

        console.log(
            'Opening HammerLoop...'
        );

        await this.welcomePage
            .tapGetStarted();

        /* ========================================================= */
        /* Login as Employer                                         */
        /* ========================================================= */

        console.log(
            'Logging in as employer...'
        );

        await this.loginFlow
            .loginEmployer();

        /* ========================================================= */
        /* Search Worker                                             */
        /* ========================================================= */

        console.log(
            `Searching for ${workerName}...`
        );

        await this.findWorkerPage
            .searchWorker(
                workerName
            );

        /* ========================================================= */
        /* Verify Worker Card                                         */
        /* ========================================================= */

        await this.findWorkerPage
            .verifyWorkerCard(
                workerName
            );

        /* ========================================================= */
        /* Hire Worker                                                */
        /* ========================================================= */

        console.log(
            `Hiring ${workerName}...`
        );

        await this.findWorkerPage
            .tapHireMe();

        /* ========================================================= */
        /* Submit Recommendation                                      */
        /* ========================================================= */

        console.log(
            'Submitting worker recommendation...'
        );

        await this.findWorkerPage
            .tapRecommend();

        await this.findWorkerPage
            .verifyRecommendationSubmitted();

        /* ========================================================= */
        /* Remove Recommendation                                      */
        /* ========================================================= */

        console.log(
            'Removing worker recommendation...'
        );

        await this.findWorkerPage
            .tapRecommend();

        await this.findWorkerPage
            .verifyRecommendationRemoved();

        console.log(
            'Employer worker recommendation flow completed successfully.'
        );
    }
}

module.exports = {
    EmployerWorkerRecommendationFlow
};