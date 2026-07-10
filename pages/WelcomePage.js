/*************************************************************
 * Page Object: Welcome Page
 * Purpose: Handle actions on the HammerLoop opening screen.
 *************************************************************/

class WelcomePage {
    constructor(driver) {
        this.driver = driver;

        this.getStartedButton =
            driver.$('~Get started');
    }

    async tapGetStarted() {
        await this.getStartedButton.waitForDisplayed({
            timeout: 15000
        });

        await this.getStartedButton.click();
    }
}

module.exports = {
    WelcomePage
};