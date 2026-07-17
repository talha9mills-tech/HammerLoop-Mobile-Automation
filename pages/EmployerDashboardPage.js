/*************************************************************
 * Page Object: EmployerDashboardPage
 * Purpose: Verify Employer Dashboard is loaded successfully.
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

        await this.addJobButton.waitForDisplayed({
            timeout: 30000
        });

        if (!await this.findWorkerTab.isDisplayed()) {

            throw new Error(
                'Employer dashboard did not load successfully.'
            );
        }

        if (!await this.addJobButton.isDisplayed()) {

            throw new Error(
                'Add Job button is not visible on Employer dashboard.'
            );
        }
    }
}

module.exports = {
    EmployerDashboardPage
};