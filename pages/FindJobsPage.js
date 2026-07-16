/*************************************************************
 * Page Object: FindJobsPage
 * Purpose: Handle Find Jobs screen actions.
 *************************************************************/

class FindJobsPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Find Jobs Elements                                        */
        /* ========================================================= */

        this.searchInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        this.firstApplyButton =
            driver.$(
                'android=new UiSelector().description("Apply").instance(0)'
            );
    }

    /* ========================================================= */
    /* Dynamic Job Card                                           */
    /* ========================================================= */

    getJobCard(jobTitle) {

        return this.driver.$(
            `android=new UiSelector().descriptionContains("${jobTitle}")`
        );
    }

    /* ========================================================= */
    /* Search Job                                                 */
    /* ========================================================= */

    async searchJob(jobTitle) {

        await this.searchInput.waitForDisplayed({
            timeout: 15000
        });

        await this.searchInput.click();

        await this.searchInput.clearValue();

        await this.searchInput.setValue(jobTitle);

        await this.driver.pause(2000);
    }

    /* ========================================================= */
    /* Verify First Job Card                                     */
    /* ========================================================= */

    async verifyFirstJobCard(
        jobTitle,
        companyName
    ) {

        const jobCard =
            this.getJobCard(jobTitle);

        await jobCard.waitForDisplayed({
            timeout: 15000
        });

        const description =
            await jobCard.getAttribute(
                'content-desc'
            );

        if (!description.includes(jobTitle)) {

            throw new Error(
                `Job title "${jobTitle}" was not found in the first result.`
            );
        }

        if (!description.includes(companyName)) {

            throw new Error(
                `Company "${companyName}" was not found in the first result.`
            );
        }

        console.log(
            'Verified company name and job title successfully.'
        );
    }

    /* ========================================================= */
    /* Apply                                                      */
    /* ========================================================= */

    async tapApply() {

        await this.firstApplyButton.waitForDisplayed({
            timeout: 15000
        });

        await this.firstApplyButton.click();
    }
}

module.exports = {
    FindJobsPage
};