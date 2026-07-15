/*************************************************************
 * Page Object: CreateJobPage
 * Purpose: Handle all interactions on the Create Job wizard.
 *************************************************************/

class CreateJobPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* STEP 1 - Job Details                                      */
        /* ========================================================= */

        this.tradesDropdown =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        this.tradesDropdownInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        this.jobNameInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        this.jobDescriptionInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(2)'
            );

        this.nextStepButton =
            driver.$('~Next Step');

        /* ========================================================= */
        /* STEP 2 - Duration                                         */
        /* ========================================================= */

        this.startDatePicker =
            driver.$('~Select Date');

        this.calendarOkButton =
            driver.$('~OK');

        this.durationInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* STEP 3 - Pay Rate                                         */
        /* ========================================================= */

        this.payRateInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* STEP 4 - Union Workers                                    */
        /* ========================================================= */

        this.nonUnionWorkersOption =
            driver.$(
                'android=new UiSelector().description("No").instance(0)'
            );

        /* ========================================================= */
        /* STEP 5 - Location                                         */
        /* ========================================================= */

        this.locationInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* STEP 6 - Certifications                                  */
        /* ========================================================= */

        this.certificationInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* STEP 8 - Experience                                       */
        /* ========================================================= */

        this.experienceRangeDropdown =
            driver.$(
                'android=new UiSelector().className("android.view.View").instance(11)'
            );

        /* ========================================================= */
        /* STEP 9 - Post Job                                         */
        /* ========================================================= */

        this.postJobButton =
            driver.$('~Post Job');

        this.jobPostSuccessBanner =
            driver.$(
                'android=new UiSelector().descriptionContains("Job Post Completed Successfully!")'
            );

        this.viewJobButton =
            driver.$('~View Job');
    }

    /* ========================================================= */
    /* Trade Selection                                           */
    /* ========================================================= */

    async openTradesDropdown() {

        await this.tradesDropdown.waitForDisplayed({
            timeout: 15000
        });

        await this.tradesDropdown.click();
    }

    async searchTrade(trade) {

        await this.tradesDropdownInput.waitForDisplayed({
            timeout: 15000
        });

        await this.tradesDropdownInput.click();

        await this.tradesDropdownInput.clearValue();

        await this.tradesDropdownInput.setValue(trade);
    }

    async selectTrade(trade) {

        const tradeOption =
            this.driver.$(`~${trade}`);

        await tradeOption.waitForDisplayed({
            timeout: 15000
        });

        await tradeOption.click();
    }

    /* ========================================================= */
    /* Job Information                                           */
    /* ========================================================= */

    async enterJobTitle(jobTitle) {

        await this.jobNameInput.waitForDisplayed({
            timeout: 15000
        });

        await this.jobNameInput.click();

        await this.jobNameInput.clearValue();

        await this.jobNameInput.setValue(jobTitle);
    }

    async enterJobDescription(description) {

        await this.jobDescriptionInput.waitForDisplayed({
            timeout: 15000
        });

        await this.jobDescriptionInput.click();

        await this.jobDescriptionInput.clearValue();

        await this.jobDescriptionInput.setValue(description);
    }

    async tapNextStep() {

        await this.nextStepButton.waitForDisplayed({
            timeout: 15000
        });

        await this.nextStepButton.click();
    }

    /* ========================================================= */
    /* Start Date                                                */
    /* ========================================================= */

    async selectTodayAsStartDate() {

        await this.startDatePicker.waitForDisplayed({
            timeout: 15000
        });

        await this.startDatePicker.click();

        await this.calendarOkButton.waitForDisplayed({
            timeout: 15000
        });

        await this.calendarOkButton.click();
    }

    async enterDuration(days) {

        await this.durationInput.waitForDisplayed({
            timeout: 15000
        });

        await this.durationInput.click();

        await this.durationInput.clearValue();

        await this.durationInput.setValue(String(days));
    }

    /* ========================================================= */
    /* Pay Rate                                                  */
    /* ========================================================= */

    async enterPayRate(rate) {

        await this.payRateInput.waitForDisplayed({
            timeout: 15000
        });

        await this.payRateInput.click();

        await this.payRateInput.clearValue();

        await this.payRateInput.setValue(String(rate));
    }

    /* ========================================================= */
    /* Union Workers                                             */
    /* ========================================================= */

    async selectNonUnionWorkers() {

        await this.nonUnionWorkersOption.waitForDisplayed({
            timeout: 15000
        });

        await this.nonUnionWorkersOption.click();
    }

    /* ========================================================= */
    /* Location                                                  */
    /* ========================================================= */

    async searchLocation(location) {

        await this.locationInput.waitForDisplayed({
            timeout: 15000
        });

        await this.locationInput.click();

        await this.locationInput.clearValue();

        await this.locationInput.setValue(location);
    }

    async selectFirstLocationSuggestion(location) {

        const option =
            this.driver.$(
                `android=new UiSelector().descriptionContains("${location}")`
            );

        await option.waitForDisplayed({
            timeout: 15000
        });

        await option.click();
    }

    /* ========================================================= */
    /* Certifications                                            */
    /* ========================================================= */

    async searchCertification(trade) {

        await this.certificationInput.waitForDisplayed({
            timeout: 15000
        });

        await this.certificationInput.click();

        await this.certificationInput.clearValue();

        await this.certificationInput.setValue(trade);
    }

    async verifyTradeVisible(trade) {

        const tradeOption =
            this.driver.$(`~${trade}`);

        await tradeOption.waitForDisplayed({
            timeout: 15000
        });
    }

    async selectFirstCertification() {

        const certification =
            this.driver.$(
                '//android.view.View[@content-desc][1]'
            );

        await certification.waitForDisplayed({
            timeout: 15000
        });

        await certification.click();
    }

    /* ========================================================= */
    /* Experience                                                */
    /* ========================================================= */

    async openExperienceDropdown() {

        await this.experienceRangeDropdown.waitForDisplayed({
            timeout: 15000
        });

        await this.experienceRangeDropdown.click();
    }

    async selectExperienceRange(experience) {

        const option =
            this.driver.$(`~${experience}`);

        await option.waitForDisplayed({
            timeout: 15000
        });

        await option.click();
    }

    /* ========================================================= */
    /* Finish                                                    */
    /* ========================================================= */

    async tapPostJob() {

        await this.postJobButton.waitForDisplayed({
            timeout: 15000
        });

        await this.postJobButton.click();
    }

    async verifyJobPostedSuccessfully() {

        await this.jobPostSuccessBanner.waitForDisplayed({
            timeout: 30000
        });
    }

    async tapViewJob() {

        await this.viewJobButton.waitForDisplayed({
            timeout: 15000
        });

        await this.viewJobButton.click();
    }
}

module.exports = {
    CreateJobPage
};