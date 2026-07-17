/*************************************************************
 * Page Object: CreateJobPage
 * Purpose: Handle all interactions on the Create Job wizard.
 *************************************************************/

class CreateJobPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Entry Point                                               */
        /* ========================================================= */

        this.addJobButton =
            driver.$(
                '~Add Job'
            );

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

    async hideKeyboardIfVisible() {

        try {

            if (await this.driver.isKeyboardShown()) {

                await this.driver.hideKeyboard();

                await this.driver.pause(500);
            }

        } catch (error) {
            // Keyboard wasn't visible
        }
    }

    /* ========================================================= */
    /* Entry Point                                               */
    /* ========================================================= */

    async tapAddJob() {

        await this.addJobButton.waitForDisplayed({
            timeout: 15000
        });

        await this.addJobButton.click();
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

        //await this.hideKeyboardIfVisible();
    }

    async enterJobDescription(description) {

        await this.jobDescriptionInput.waitForDisplayed({
            timeout: 15000
        });

        await this.jobDescriptionInput.click();

        await this.jobDescriptionInput.clearValue();

        await this.jobDescriptionInput.setValue(description);

        //await this.hideKeyboardIfVisible();
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

        //await this.hideKeyboardIfVisible();
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

        //await this.hideKeyboardIfVisible();
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

    /* ========================================================= */
    /* STEP 6 - Certifications                                  */
    /* ========================================================= */

    async searchCertification(trade) {
        await this.certificationInput.waitForDisplayed({ timeout: 15000 });
        await this.certificationInput.click();
        await this.certificationInput.clearValue();
        await this.certificationInput.setValue(trade);
        
        // Wait for results to load
        await this.driver.pause(1000);
    }

    async getAllCertificationOptions() {
        // Get all visible clickable certification options
        const allElements = await this.driver.$$(
            'android=new UiSelector().className("android.view.View").clickable(true)'
        );
        
        // Filter to only certification items (content-desc contains certification-related text)
        const certifications = [];
        for (const element of allElements) {
            const desc = await element.getAttribute('content-desc');
            // Only include elements that look like certifications
            if (desc && desc.length > 0 && !desc.includes('Search') && !desc.includes('Cancel')) {
                certifications.push(element);
            }
        }
        
        return certifications;
    }

        async selectRandomCertifications() {
        const certifications = await this.getAllCertificationOptions();
        const totalAvailable = certifications.length;
        
        console.log(`📋 Found ${totalAvailable} certification(s) available`);
        
        if (totalAvailable === 0) {
            console.log('⚠️ No certifications found, skipping selection');
            return;
        }
        
        // Determine how many to select (max 2, min 1)
        const selectCount = Math.min(2, totalAvailable);
        console.log(`🎯 Selecting ${selectCount} certification(s)`);
        
        // Get random indices
        const indices = this.getRandomIndices(totalAvailable, selectCount);
        
        // Select certifications at random indices
        for (const index of indices) {
            await certifications[index].click();
            console.log(`✅ Selected certification ${index + 1}`);
            await this.driver.pause(300);
        }
    }

    getRandomIndices(total, count) {
        const indices = [];
        const available = Array.from({ length: total }, (_, i) => i);
        
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            indices.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        return indices;
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