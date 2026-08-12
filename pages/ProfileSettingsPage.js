/*************************************************************
 * Page Object: Profile Settings Page
 * Purpose: Handle profile settings navigation actions.
 *************************************************************/

class ProfileSettingsPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Change Password Button                                     */
        /* ========================================================= */

        this.changePasswordButton =
            driver.$(
                '~Change Password'
            );
    }

    /* ========================================================= */
    /* Tap Change Password                                        */
    /* ========================================================= */

    async tapChangePassword() {

        await this.changePasswordButton.waitForDisplayed({
            timeout: 15000
        });

        await this.changePasswordButton.click();
    }
}

module.exports = {
    ProfileSettingsPage
};