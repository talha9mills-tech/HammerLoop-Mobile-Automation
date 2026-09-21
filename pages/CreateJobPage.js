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

    /* ========================================================= */
    /* Keyboard Helpers                                          */
    /* ========================================================= */

    /**
     * Hides the keyboard ONLY if it is really showing.
     *
     * Same lesson as SignUpPage: a blind driver.hideKeyboard() can
     * press BACK on Android and navigate away from the form when the
     * keyboard is already closing/closed. The isKeyboardShown() guard
     * prevents that.
     *
     * Returns true if a hide was performed, false otherwise.
     */
    async hideKeyboardIfVisible() {

        try {

            if (await this.driver.isKeyboardShown()) {

                await this.driver.hideKeyboard();

                await this.driver.pause(500);

                return true;
            }

        } catch (error) {
            // Keyboard wasn't visible / couldn't be hidden - ignore.
        }

        return false;
    }

    /**
     * Reactive keyboard handling (same approach as SignUpPage.fillInput):
     *
     *  1. Give the field a short chance to be displayed.
     *  2. If it is NOT displayed, the keyboard is most likely covering
     *     it -> hide the keyboard (only if shown) and wait again.
     *  3. Then click, clear and type.
     *
     * The keyboard is never hidden proactively, so it can't interfere
     * with screens/steps where it isn't the problem.
     */
    async fillInput(input, value) {

        try {

            await input.waitForDisplayed({
                timeout: 3000
            });

        } catch {

            /* Field is likely below the keyboard.
            Hide the keyboard and try again. */

            await this.hideKeyboardIfVisible();

            await input.waitForDisplayed({
                timeout: 15000
            });
        }

        try {

            await input.scrollIntoView();

        } catch {

            // Ignore if the driver doesn't support it.
        }

        await input.click();

        await input.clearValue();

        await input.setValue(String(value));
    }

    /**
     * Same idea for buttons (Next Step / Post Job): if the button is
     * not displayed because the keyboard is covering it, hide the
     * keyboard (only if shown) and retry before tapping.
     */
    async tapButton(button) {

        try {

            await button.waitForDisplayed({
                timeout: 3000
            });

        } catch {

            await this.hideKeyboardIfVisible();

            await button.waitForDisplayed({
                timeout: 15000
            });
        }

        await button.click();
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

        await this.fillInput(
            this.tradesDropdownInput,
            trade
        );
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

        await this.fillInput(
            this.jobNameInput,
            jobTitle
        );
    }

    async enterJobDescription(description) {

        // Keyboard from the title field may still be open and hiding
        // this field -> fillInput() handles that automatically.
        await this.fillInput(
            this.jobDescriptionInput,
            description
        );
    }

    async tapNextStep() {

        await this.tapButton(
            this.nextStepButton
        );
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

        await this.fillInput(
            this.durationInput,
            days
        );
    }

    /* ========================================================= */
    /* Pay Rate                                                  */
    /* ========================================================= */

    async enterPayRate(rate) {

        await this.fillInput(
            this.payRateInput,
            rate
        );
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

        await this.fillInput(
            this.locationInput,
            location
        );
    }

    async selectFirstLocationSuggestion(location) {

        const suggestion =
            this.driver.$(
                `android=new UiSelector().descriptionContains("${location}")`
            );

        await suggestion.waitForExist({
            timeout: 15000
        });

        await suggestion.waitForDisplayed({
            timeout: 15000
        });

        await suggestion.click();
    }

    /* ========================================================= */
    /* Certifications                                            */
    /* ========================================================= */

    async searchCertification(trade) {

        await this.fillInput(
            this.certificationInput,
            trade
        );
    }

    async getAllCertificationOptions() {

        await this.driver.waitUntil(

            async () => {

                const allElements =
                    await this.driver.$$(
                        'android=new UiSelector().className("android.view.View").clickable(true)'
                    );

                const certifications = [];

                for (const element of allElements) {

                    const desc =
                        await element.getAttribute(
                            'content-desc'
                        );

                    if (
                        desc &&
                        desc.trim().length > 0 &&
                        desc !== 'Next Step' &&
                        desc !== 'Search' &&
                        desc !== 'Cancel'
                    ) {

                        certifications.push(desc);
                    }
                }

                return certifications.length > 0;

            },

            {
                timeout: 15000,
                interval: 300,
                timeoutMsg: 'Certification options never appeared.'
            }
        );

        const allElements =
            await this.driver.$$(
                'android=new UiSelector().className("android.view.View").clickable(true)'
            );

        const certifications = [];

        for (const element of allElements) {

            const desc =
                await element.getAttribute(
                    'content-desc'
                );

            if (
                desc &&
                desc.trim().length > 0 &&
                desc !== 'Next Step' &&
                desc !== 'Search' &&
                desc !== 'Cancel'
            ) {

                certifications.push(desc);
            }
        }

        return certifications;
    }

    async selectCertification(certificationName) {

        const certification =
            this.driver.$(
                `~${certificationName}`
            );

        await certification.waitForDisplayed({
            timeout: 15000
        });

        await certification.click();

        console.log(
            `✅ Selected: ${certificationName}`
        );

        await this.driver.pause(300);
    }

    async selectRandomCertifications() {

        const certifications =
            await this.getAllCertificationOptions();

        const totalAvailable =
            certifications.length;

        console.log(
            `📋 Found ${totalAvailable} certification(s) available`
        );

        if (totalAvailable === 0) {

            throw new Error(
                'No certification options were found.'
            );
        }

        const selectCount =
            Math.min(
                2,
                totalAvailable
            );

        console.log(
            `🎯 Selecting ${selectCount} certification(s)`
        );

        const indices =
            this.getRandomIndices(
                totalAvailable,
                selectCount
            );

        for (const index of indices) {

            await this.selectCertification(
                certifications[index]
            );
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
            this.driver.$(
                `~${experience}`
            );

        await option.waitForDisplayed({
            timeout: 15000
        });

        await option.click();

        const selectedExperience =
            this.driver.$(
                `android=new UiSelector().text("${experience}")`
            );

        await selectedExperience.waitForDisplayed({
            timeout: 10000
        });

        console.log(
            `✅ Experience selected: ${experience}`
        );
    }

    /* ========================================================= */
    /* Finish                                                    */
    /* ========================================================= */

    async tapPostJob() {

        await this.tapButton(
            this.postJobButton
        );
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