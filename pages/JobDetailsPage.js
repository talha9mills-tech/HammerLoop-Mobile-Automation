/*************************************************************
 * Page Object: JobDetailsPage
 * Purpose: Handle Job Details and Job Application actions.
 *************************************************************/

class JobDetailsPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Job Details Elements                                      */
        /* ========================================================= */

        this.loopMeInButton =
            driver.$(
                '~Loop Me In'
            );

        this.continueButton =
            driver.$(
                '~Continue'
            );
    }

    /* ========================================================= */
    /* Dynamic Elements                                           */
    /* ========================================================= */

    getJobTitle(jobTitle) {

        return this.driver.$(
            `~${jobTitle}`
        );
    }

    getApplicationSubmittedModal() {

        return this.driver.$(
            'android=new UiSelector().descriptionContains("Application Submitted!")'
        );
    }

    /* ========================================================= */
    /* Verify Job Title                                           */
    /* ========================================================= */

    async verifyJobTitle(jobTitle) {

        const title =
            this.getJobTitle(jobTitle);

        await title.waitForDisplayed({
            timeout: 15000
        });

        console.log(
            'Job Details screen verified.'
        );
    }

    /* ========================================================= */
    /* Loop Me In                                                 */
    /* ========================================================= */

    async tapLoopMeIn() {

        await this.loopMeInButton.waitForDisplayed({
            timeout: 15000
        });

        await this.loopMeInButton.click();
    }

    /* ========================================================= */
    /* Verify Success Modal                                       */
    /* ========================================================= */

    async verifyApplicationSubmitted() {

        const modal =
            this.getApplicationSubmittedModal();

        await modal.waitForDisplayed({
            timeout: 15000
        });

        console.log(
            'Application Submitted modal verified.'
        );
    }

    /* ========================================================= */
    /* Continue                                                   */
    /* ========================================================= */

    async tapContinue() {

        await this.continueButton.waitForDisplayed({
            timeout: 15000
        });

        await this.continueButton.click();

        await this.driver.pause(2000);
    }
}

module.exports = {
    JobDetailsPage
};