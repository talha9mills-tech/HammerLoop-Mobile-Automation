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
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        /* ========================================================= */
        /* Location Search                                           */
        /* ========================================================= */

        this.locationSearchInput =
            this.driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(2)'
            );

        /* ========================================================= */
        /* About Your Company Input                                  */
        /* ========================================================= */

        this.aboutYourCompanyInput =
            this.driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(3)'
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

        await suggestion.waitForExist({
            timeout: 15000
        });

        await suggestion.waitForDisplayed({
            timeout: 15000
        });

        await suggestion.click();
    }

    /* ========================================================= */
    /* Enter About Your Company                                  */
    /* ========================================================= */

    async enterAboutYourCompany(description) {

        await this.aboutYourCompanyInput.waitForDisplayed({
            timeout: 15000
        });

        await this.aboutYourCompanyInput.click();

        await this.aboutYourCompanyInput.clearValue();

        await this.aboutYourCompanyInput.setValue(
            description
        );

        await this.driver.pause(200);

        console.log(
            `Entered About Your Company: ${description.substring(0, 50)}...`
        );
    }

    /* ========================================================= */
    /* Save Employer Profile                                      */
    /* ========================================================= */

    async tapSaveAndContinue() {

        await this.scrollToSaveAndContinue();

        await this.saveAndContinueButton.waitForDisplayed({
            timeout: 10000
        });

        await this.saveAndContinueButton.click();
    }

    /* ========================================================= */
    /* Scroll To Save & Continue                                  */
    /* ========================================================= */

    async scrollToSaveAndContinue() {

        const scrollableSelector =
            'new UiScrollable(' +
            'new UiSelector()' +
            '.className("android.widget.ScrollView")' +
            ')' +
            '.scrollIntoView(' +
            'new UiSelector()' +
            '.description("Save & Continue")' +
            ')';

        const button =
            this.driver.$(
                `android=${scrollableSelector}`
            );

        await button.waitForDisplayed({
            timeout: 10000
        });
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