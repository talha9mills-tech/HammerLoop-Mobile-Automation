/*************************************************************
 * Page Object: Forgot Password Page
 * Purpose: Handle forgot password screen actions and
 *          validations.
 *************************************************************/

class ForgotPasswordPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Forgot Password Link                                      */
        /* ========================================================= */

        this.forgotPasswordLink =
            driver.$(
                '~Forgot Password?'
            );

        /* ========================================================= */
        /* Reset Password Screen / Heading                           */
        /* ========================================================= */

        this.resetPasswordHeading =
            driver.$(
                '~Reset your password'
            );

        /* ========================================================= */
        /* Reset Password Email Input                                */
        /* ========================================================= */

        this.resetPasswordEmailInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* Send Button                                                */
        /* ========================================================= */

        this.sendButton =
            driver.$(
                '~Send'
            );

        /* ========================================================= */
        /* Check Email Message                                        */
        /* ========================================================= */

        this.checkEmailMessage =
            driver.$(
                '~Please check your email.'
            );
    }

    /* ========================================================= */
    /* Verify Forgot Password Link                                */
    /* ========================================================= */

    async verifyForgotPasswordVisible() {

        await this.forgotPasswordLink
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Forgot Password link is visible.'
        );
    }

    /* ========================================================= */
    /* Tap Forgot Password                                        */
    /* ========================================================= */

    async tapForgotPassword() {

        await this.forgotPasswordLink
            .waitForDisplayed({
                timeout: 15000
            });

        await this.forgotPasswordLink.click();
    }

    /* ========================================================= */
    /* Verify Reset Password Screen                               */
    /* ========================================================= */

    async verifyResetPasswordScreen() {

        await this.resetPasswordHeading
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Reset Password screen is visible.'
        );
    }

    /* ========================================================= */
    /* Enter Reset Password Email                                 */
    /* ========================================================= */

    async enterResetPasswordEmail(email) {

        await this.resetPasswordEmailInput
            .waitForDisplayed({
                timeout: 15000
            });

        await this.resetPasswordEmailInput.click();

        await this.resetPasswordEmailInput.clearValue();

        await this.resetPasswordEmailInput.setValue(
            email
        );
    }

    /* ========================================================= */
    /* Tap Send                                                   */
    /* ========================================================= */

    async tapSend() {

        await this.sendButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.sendButton.click();
    }

    /* ========================================================= */
    /* Verify Check Email Message                                 */
    /* ========================================================= */

    async verifyCheckEmailMessage() {

        await this.checkEmailMessage
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Password reset email request was submitted successfully.'
        );
    }
}

module.exports = {
    ForgotPasswordPage
};