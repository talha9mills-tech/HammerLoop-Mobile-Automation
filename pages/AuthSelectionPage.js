/*************************************************************
 * Page Object: Auth Selection Page
 * Purpose: Handle Login and Sign Up selection actions.
 *************************************************************/

class AuthSelectionPage {
    constructor(driver) {
        this.driver = driver;

        this.signUpButton =
            driver.$('~Sign Up');
    }

    async tapSignUp() {
        await this.signUpButton.waitForDisplayed({
            timeout: 15000
        });

        await this.signUpButton.click();
    }
}

module.exports = {
    AuthSelectionPage
};