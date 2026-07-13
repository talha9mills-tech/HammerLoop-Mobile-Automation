/*************************************************************
 * Page Object: Role Selection Page
 * Purpose: Handle Worker or Employer role selection.
 *************************************************************/

class RoleSelectionPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Worker Role                                               */
        /* ========================================================= */

        this.workerRoleButton =
            driver.$(
                '~I\'m Worker'
            );

        /* ========================================================= */
        /* Employer Role                                             */
        /* ========================================================= */

        this.employerRoleButton =
            driver.$(
                '~I\'m Employer'
            );

        /* ========================================================= */
        /* Continue Button                                           */
        /* ========================================================= */

        this.continueButton =
            driver.$(
                '~Continue'
            );
    }

    /* ========================================================= */
    /* Select Worker Role                                         */
    /* ========================================================= */

    async selectWorkerRole() {

        await this.workerRoleButton.waitForDisplayed({
            timeout: 15000
        });

        await this.workerRoleButton.click();
    }

    /* ========================================================= */
    /* Select Employer Role                                       */
    /* ========================================================= */

    async selectEmployerRole() {

        await this.employerRoleButton.waitForDisplayed({
            timeout: 15000
        });

        await this.employerRoleButton.click();
    }

    /* ========================================================= */
    /* Tap Continue                                               */
    /* ========================================================= */

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