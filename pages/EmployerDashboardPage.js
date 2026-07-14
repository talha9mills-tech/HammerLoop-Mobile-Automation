/*************************************************************
 * Page Object: EmployerDashboardPage
 * Purpose: Handle Employer Dashboard actions.
 *************************************************************/

class EmployerDashboardPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Dashboard Elements                                        */
        /* ========================================================= */

        this.findWorkerTab =
            driver.$(
                '~Find Worker'
            );

        this.addJobButton =
            driver.$(
                '~Add Job'
            );
    }

    /* ========================================================= */
    /* Verify Employer Dashboard Loaded                          */
    /* ========================================================= */

    async verifyDashboardLoaded() {

        await this.findWorkerTab.waitForDisplayed({
            timeout: 30000
        });

        if (!await this.findWorkerTab.isDisplayed()) {

            throw new Error(
                'Employer dashboard did not load successfully.'
            );
        }
    }

    /* ========================================================= */
    /* Tap Add Job                                                */
    /* ========================================================= */

    async tapAddJob() {

        await this.addJobButton.waitForDisplayed({
            timeout: 15000
        });

        await this.addJobButton.click();
    }

    /* ========================================================= */
    /* Start Create Job Flow                                      */
    /* ========================================================= */

    async startCreateJob() {

        await this.verifyDashboardLoaded();

        await this.tapAddJob();
    }
}

module.exports = {
    EmployerDashboardPage
};