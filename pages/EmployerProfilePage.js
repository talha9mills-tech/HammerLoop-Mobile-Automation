/*************************************************************
 * Page Object: EmployerProfilePage
 * Purpose: Handle Employer Profile Completion screen.
 *************************************************************/

class EmployerProfilePage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Complete Employer Card Banner                            */
        /* ========================================================= */

        this.completeEmployerCardBanner =
            this.driver.$(
                '//android.view.View[@content-desc="Complete your Employer Card\nAdd your trades and location to post jobs and message workers."]'
            );

        /* ========================================================= */
        /* Trade Search                                              */
        /* ========================================================= */

        this.tradeSearchInput =
            this.driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        /* ========================================================= */
        /* Location Search                                           */
        /* ========================================================= */

        this.locationSearchInput =
            this.driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        /* ========================================================= */
        /* Save & Continue                                           */
        /* ========================================================= */

        this.saveAndContinueButton =
            this.driver.$(
                '~Save & Continue'
            );

        /* ========================================================= */
        /* Add Job Button                                            */
        /* ========================================================= */

        this.addJobButton =
            this.driver.$(
                '~Add Job'
            );
    }

    /* ========================================================= */
    /* Open Employer Card                                         */
    /* ========================================================= */

    async tapCompleteEmployerCard() {

        await this.completeEmployerCardBanner.waitForDisplayed({
            timeout: 15000
        });

        await this.completeEmployerCardBanner.click();
    }

    /* ========================================================= */
    /* Search Trade                                               */
    /* ========================================================= */

    async searchTrade(trade) {

        await this.tradeSearchInput.waitForDisplayed({
            timeout: 10000
        });

        await this.tradeSearchInput.click();

        await this.tradeSearchInput.clearValue();

        await this.tradeSearchInput.setValue(
            trade
        );
    }

    /* ========================================================= */
    /* Select Trade                                               */
    /* ========================================================= */

    async selectTrade(trade) {

        const tradeOption =
            this.driver.$(
                `~${trade}`
            );

        await tradeOption.waitForDisplayed({
            timeout: 10000
        });

        await tradeOption.click();
    }

    /* ========================================================= */
    /* Search Location                                            */
    /* ========================================================= */

    async searchLocation(location) {

        await this.locationSearchInput.waitForDisplayed({
            timeout: 10000
        });

        await this.locationSearchInput.click();

        await this.locationSearchInput.clearValue();

        await this.locationSearchInput.setValue(
            location
        );
    }

    /* ========================================================= */
    /* Select First Location Suggestion                           */
    /* ========================================================= */

    async selectFirstLocationSuggestion(location) {

        const suggestion =
            this.driver.$(
                `android=new UiSelector().descriptionContains("${location}")`
            );

        await suggestion.waitForDisplayed({
            timeout: 15000
        });

        await suggestion.click();
    }

    /* ========================================================= */
    /* Save Employer Profile                                      */
    /* ========================================================= */

    async tapSaveAndContinue() {

        await this.saveAndContinueButton.waitForDisplayed({
            timeout: 10000
        });

        await this.saveAndContinueButton.click();
    }

    /* ========================================================= */
    /* Is Employer Card Banner Displayed                          */
    /* ========================================================= */

    async isEmployerCardBannerDisplayed() {

        try {

            return await this.completeEmployerCardBanner.isDisplayed();

        } catch {

            return false;
        }
    }

    /* ========================================================= */
    /* Is Add Job Button Displayed                                */
    /* ========================================================= */

    async isAddJobButtonDisplayed() {

        await this.addJobButton.waitForDisplayed({
            timeout: 10000
        });

        return await this.addJobButton.isDisplayed();
    }
}

module.exports = {
    EmployerProfilePage
};