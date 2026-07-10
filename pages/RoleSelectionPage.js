/*************************************************************
 * Page Object: Role Selection Page
 * Purpose: Handle Worker or Employer role selection.
 *************************************************************/

class RoleSelectionPage {
    constructor(driver) {
        this.driver = driver;

        this.workerRoleButton =
            driver.$('~I\'m Worker');

        this.continueButton =
            driver.$('~Continue');
    }

    async selectWorkerRole() {
        await this.workerRoleButton.waitForDisplayed({
            timeout: 15000
        });

        await this.workerRoleButton.click();
    }

    async tapContinue() {
        await this.continueButton.waitForDisplayed({
            timeout: 15000
        });

        await this.continueButton.click();
    }
}

module.exports = {
    RoleSelectionPage
};