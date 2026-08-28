/*************************************************************
 * Flow: Employer Onboarding Flow
 * Purpose: Complete the Employer Profile after signup.
 *************************************************************/

const {
    EmployerProfilePage
} = require('../pages/EmployerProfilePage');

const trades =
    require('../data/fixtures/trades');

const locations =
    require('../data/fixtures/locations');

const aboutCompanyDescriptions =
    require('../data/fixtures/aboutCompany');

const {
    getRandomItem,
    getRandomItems
} = require('../utils/randomHelper');

class EmployerOnboardingFlow {

    constructor(driver) {

        this.driver = driver;

        this.employerProfilePage =
            new EmployerProfilePage(driver);
    }

    /* ========================================================= */
    /* Complete Employer Profile                                 */
    /* ========================================================= */

    async completeEmployerProfile() {

        console.log(
            'Opening Employer Card...'
        );

        await this.employerProfilePage
            .tapCompleteEmployerCard();

        /* ===================================================== */
        /* Select Five Random Trades                             */
        /* ===================================================== */

        const selectedTrades =
            getRandomItems(
                trades,
                5
            );

        console.log(
            'Selected Trades:',
            selectedTrades.join(', ')
        );

        for (const trade of selectedTrades) {

            await this.employerProfilePage
                .searchTrade(trade);

            await this.employerProfilePage
                .selectTrade(trade);
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

        await this.employerProfilePage
            .searchLocation(location);

        await this.employerProfilePage
            .selectFirstLocationSuggestion(location);

        /* ===================================================== */
        /* Enter About Your Company                              */
        /* ===================================================== */

        const aboutCompany =
            getRandomItem(
                aboutCompanyDescriptions
            );

        console.log(
            `Selected About Your Company: ${aboutCompany.substring(0, 50)}...`
        );

        await this.employerProfilePage
            .enterAboutYourCompany(aboutCompany);

        /* ===================================================== */
        /* Save Employer Profile                                 */
        /* ===================================================== */

        await this.employerProfilePage
            .tapSaveAndContinue();

        /* ===================================================== */
        /* Verify Employer Card Banner Removed                   */
        /* ===================================================== */

        const bannerVisible =
            await this.employerProfilePage
                .isEmployerCardBannerDisplayed();

        if (bannerVisible) {

            throw new Error(
                'Employer Card banner is still visible after completing profile.'
            );
        }

        /* ===================================================== */
        /* Verify Add Job Button                                 */
        /* ===================================================== */

        const addJobVisible =
            await this.employerProfilePage
                .isAddJobButtonDisplayed();

        if (!addJobVisible) {

            throw new Error(
                'Add Job button is not visible after completing Employer profile.'
            );
        }

        console.log(
            'Employer profile completed successfully.'
        );
    }
}

module.exports = {
    EmployerOnboardingFlow
};