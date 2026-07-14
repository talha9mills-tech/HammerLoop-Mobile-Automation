/*************************************************************
 * Page Object: LoginPage
 * Purpose: Handle login form actions.
 *************************************************************/

class LoginPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Login Form Inputs                                         */
        /* ========================================================= */

        this.emailInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        this.passwordInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        /* ========================================================= */
        /* Sign In Button                                            */
        /* ========================================================= */

        this.signInButton =
            driver.$(
                '~Sign in '
            );
    }

    /* ========================================================= */
    /* Enter Email                                                */
    /* ========================================================= */

    async enterEmail(email) {

        await this.fillInput(
            this.emailInput,
            email
        );
    }

    /* ========================================================= */
    /* Enter Password                                             */
    /* ========================================================= */

    async enterPassword(password) {

        await this.fillInput(
            this.passwordInput,
            password
        );
    }

    /* ========================================================= */
    /* Tap Sign In                                                */
    /* ========================================================= */

    async tapSignIn() {

        await this.signInButton.waitForDisplayed({
            timeout: 15000
        });

        await this.signInButton.click();
    }

    /* ========================================================= */
    /* Fill Input                                                 */
    /* ========================================================= */

    async fillInput(
        input,
        value
    ) {

        await input.waitForDisplayed({
            timeout: 15000
        });

        await input.click();

        await input.clearValue();

        await input.setValue(value);
    }
}

module.exports = {
    LoginPage
};