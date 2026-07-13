/*************************************************************
 * Flow: Worker Onboarding Flow
 * Purpose: Complete the Worker Profile after signup.
 *************************************************************/

const {
    WorkerProfilePage
} = require('../pages/WorkerProfilePage');

const trades =
    require('../data/fixtures/trades');

const locations =
    require('../data/fixtures/locations');

const hourlyRates =
    require('../data/fixtures/hourlyRates');

const {
    getRandomItem,
    getRandomItems
} = require('../utils/randomHelper');

class WorkerOnboardingFlow {

    constructor(driver) {

        this.driver = driver;

        this.workerProfilePage =
            new WorkerProfilePage(driver);
    }

    /* ========================================================= */
    /* Complete Worker Profile                                   */
    /* ========================================================= */

    async completeWorkerProfile() {

        console.log(
            'Opening Worker Card...'
        );

        await this.workerProfilePage
            .tapCompleteWorkerCard();

        /* ===================================================== */
        /* Select Three Random Trades                            */
        /* ===================================================== */

        const selectedTrades =
            getRandomItems(
                trades,
                3
            );

        console.log(
            'Selected Trades:',
            selectedTrades.join(', ')
        );

        for (const trade of selectedTrades) {

            console.log(
                `Searching trade: ${trade}`
            );

            await this.workerProfilePage
                .searchTrade(trade);

            await this.driver.pause(1000);

            console.log(
                `Selecting trade: ${trade}`
            );

            await this.workerProfilePage
                .selectTrade(trade);

            await this.driver.pause(800);
        }

        /* ===================================================== */
        /* Select Random Location                                */
        /* ===================================================== */

        const location =
            getRandomItem(
                locations
            );

        console.log(
            `Selected Location: ${location}`
        );

        await this.workerProfilePage
            .searchLocation(location);

        await this.workerProfilePage
            .selectFirstLocationSuggestion(
                location
            );

        /* ===================================================== */
        /* Enter Random Hourly Rate                              */
        /* ===================================================== */

        const rate =
            getRandomItem(
                hourlyRates
            );

        console.log(
            `Selected Hourly Rate: $${rate}`
        );

        await this.workerProfilePage
            .enterHourlyRate(rate);

        /* ===================================================== */
        /* Save Worker Profile                                   */
        /* ===================================================== */

        await this.workerProfilePage
            .tapSaveAndContinue();

        /* ===================================================== */
        /* Verify Worker Card Banner Removed                     */
        /* ===================================================== */

        const bannerVisible =
            await this.workerProfilePage
                .isWorkerCardBannerDisplayed();

        if (bannerVisible) {

            throw new Error(
                'Worker Card banner is still visible after completing profile.'
            );
        }

        /* ===================================================== */
        /* Verify Find Job Button                                */
        /* ===================================================== */

        const findJobVisible =
            await this.workerProfilePage
                .isFindJobButtonDisplayed();

        if (!findJobVisible) {

            throw new Error(
                'Find Job button is not visible after completing Worker profile.'
            );
        }

        console.log(
            'Worker profile completed successfully.'
        );
    }
}

module.exports = {
    WorkerOnboardingFlow
};