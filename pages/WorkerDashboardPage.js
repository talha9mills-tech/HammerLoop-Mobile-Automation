/*************************************************************
 * Page Object: WorkerDashboardPage
 * Purpose: Handle Worker Dashboard actions.
 *************************************************************/

class WorkerDashboardPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Dashboard Elements                                        */
        /* ========================================================= */

        this.findJobTab =
            driver.$(
                '~Find Job'
            );
    }

    /* ========================================================= */
    /* Verify Worker Dashboard Loaded                            */
    /* ========================================================= */

    async verifyDashboardLoaded() {

        await this.findJobTab.waitForDisplayed({
            timeout: 30000
        });

        if (!await this.findJobTab.isDisplayed()) {

            throw new Error(
                'Worker dashboard did not load successfully.'
            );
        }
    }

    /* ========================================================= */
    /* Tap Find Job                                               */
    /* ========================================================= */

    async tapFindJob() {

        await this.findJobTab.waitForDisplayed({
            timeout: 15000
        });

        await this.findJobTab.click();
    }

    /* ========================================================= */
    /* Start Find Job Flow                                        */
    /* ========================================================= */

    async startFindJob() {

        await this.verifyDashboardLoaded();

        await this.tapFindJob();
    }
}

module.exports = {
    WorkerDashboardPage
};