/*************************************************************
 * Page Object: WorkerProfilePage
 * Purpose: Handle Worker Profile Completion screen.
 *************************************************************/

class WorkerProfilePage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Complete Worker Card Banner                               */
        /* ========================================================= */

        this.completeWorkerCardBanner =
            this.driver.$(
                '//android.view.View[@content-desc="Complete your Worker Card\nAdd your trade and location to appear in employer searches and apply to jobs."]'
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
        /* Hourly Rate                                               */
        /* ========================================================= */

        this.hourlyRateInput =
            this.driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(2)'
            );

        /* ========================================================= */
        /* About You                                                 */
        /* ========================================================= */

        this.aboutYouInput =
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
        /* Find Job                                                  */
        /* ========================================================= */

        this.findJobButton =
            this.driver.$(
                '~Find Job'
            );
    }

    /* ========================================================= */
    /* Open Worker Card                                           */
    /* ========================================================= */

    async tapCompleteWorkerCard() {

        await this.completeWorkerCardBanner.waitForDisplayed({
            timeout: 15000
        });

        await this.completeWorkerCardBanner.click();
    }

    /* ========================================================= */
    /* Search Trade                                               */
    /* ========================================================= */

    async searchTrade(trade) {

        await this.tradeSearchInput.waitForDisplayed({
            timeout: 10000
        });

        await this.tradeSearchInput.click();

        await this.driver.pause(150);

        await this.tradeSearchInput.clearValue();

        await this.driver.pause(150);

        await this.tradeSearchInput.setValue(
            trade
        );

        await this.driver.pause(500);
    }

    /* ========================================================= */
    /* Select Trade                                               */
    /* ========================================================= */

    async selectTrade(trade) {

        const tradeOption =
            await this.driver.$(
                `~${trade}`
            );

        await tradeOption.waitForDisplayed({
            timeout: 10000
        });

        await tradeOption.click();

        const selectedTrade =
            await this.driver.$(
                `//android.view.View[@content-desc="${trade}"]`
            );

        await selectedTrade.waitForDisplayed({
            timeout: 10000
        });

        await this.driver.pause(300);
    }

    /* ========================================================= */
    /* Search Location                                            */
    /* ========================================================= */

    async searchLocation(location) {

        await this.locationSearchInput.waitForDisplayed({
            timeout: 15000
        });

        await this.locationSearchInput.click();

        await this.driver.pause(200);

        await this.locationSearchInput.clearValue();

        await this.driver.pause(150);

        await this.locationSearchInput.setValue(
            location
        );

        await this.driver.pause(500);

        console.log(
            `Typed location: ${await this.locationSearchInput.getText()}`
        );
    }

    /* ========================================================= */
    /* Select First Location Suggestion                           */
    /* ========================================================= */

    async selectFirstLocationSuggestion(location) {

        const suggestion =
            await this.driver.$(
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
    /* Enter Hourly Rate                                          */
    /* ========================================================= */

    async enterHourlyRate(rate) {

        await this.driver.pause(300);

        await this.hourlyRateInput.waitForDisplayed({
            timeout: 15000
        });

        await this.hourlyRateInput.waitForEnabled({
            timeout: 15000
        });

        await this.hourlyRateInput.click();

        await this.hourlyRateInput.clearValue();

        await this.hourlyRateInput.setValue(
            String(rate)
        );

        await this.driver.pause(200);
    }

    /* ========================================================= */
    /* Enter About You                                            */
    /* ========================================================= */

    async enterAboutYou(description) {

        await this.driver.pause(300);

        await this.aboutYouInput.waitForDisplayed({
            timeout: 15000
        });

        await this.aboutYouInput.waitForEnabled({
            timeout: 15000
        });

        await this.aboutYouInput.click();

        await this.aboutYouInput.clearValue();

        await this.aboutYouInput.setValue(
            description
        );

        await this.driver.pause(200);

        console.log(
            `Entered About You description: ${description.substring(0, 50)}...`
        );
    }

    /* ========================================================= */
    /* Save Worker Profile                                        */
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
    /* Is Worker Card Banner Visible                             */
    /* ========================================================= */

    async isWorkerCardBannerDisplayed() {

        try {

            return await this.completeWorkerCardBanner.isDisplayed();

        } catch {

            return false;
        }
    }

    /* ========================================================= */
    /* Is Find Job Button Visible                                */
    /* ========================================================= */

    async isFindJobButtonDisplayed() {

        await this.findJobButton.waitForDisplayed({
            timeout: 10000
        });

        return await this.findJobButton.isDisplayed();
    }
}

module.exports = {
    WorkerProfilePage
};