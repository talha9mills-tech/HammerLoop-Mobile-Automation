/*************************************************************
 * Page Object: Profile Page
 * Purpose: Handle profile navigation actions.
 *************************************************************/

class ProfilePage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Profile Button                                             */
        /* ========================================================= */

        this.profileButton =
            driver.$(
                '~Profile'
            );

        /* ========================================================= */
        /* Profile Settings Button                                    */
        /* ========================================================= */

        this.profileSettingsButton =
            driver.$(
                '~Profile Settings'
            );
    }

    /* ========================================================= */
    /* Tap Profile                                                 */
    /* ========================================================= */

    async tapProfile() {

        await this.profileButton.waitForDisplayed({
            timeout: 15000
        });

        await this.profileButton.click();
    }

    /* ========================================================= */
    /* Tap Profile Settings                                        */
    /* ========================================================= */

    async tapProfileSettings() {

        await this.profileSettingsButton.waitForDisplayed({
            timeout: 15000
        });

        await this.profileSettingsButton.click();
    }
}

module.exports = {
    ProfilePage
};