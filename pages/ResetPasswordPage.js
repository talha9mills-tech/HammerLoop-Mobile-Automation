/*************************************************************
 * Page Object: Reset Password Page
 * Purpose: Handle OTP verification and password reset
 *          actions.
 *************************************************************/

class ResetPasswordPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* OTP Input Fields                                           */
        /* ========================================================= */

        this.otpInput1 =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        this.otpInput2 =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        this.otpInput3 =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(2)'
            );

        this.otpInput4 =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(3)'
            );

        /* ========================================================= */
        /* Verify Button                                               */
        /* ========================================================= */

        this.verifyButton =
            driver.$(
                '~Verify'
            );

        /* ========================================================= */
        /* Verification Completed Message                             */
        /* ========================================================= */

        this.verificationCompletedMessage =
            driver.$(
                '~Verification Completed ✅'
            );

        /* ========================================================= */
        /* New Password Input                                          */
        /* ========================================================= */

        this.newPasswordInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        /* ========================================================= */
        /* Confirm New Password Input                                  */
        /* ========================================================= */

        this.confirmNewPasswordInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        /* ========================================================= */
        /* Reset Password Button                                       */
        /* ========================================================= */

        this.resetPasswordButton =
            driver.$(
                '~Reset Password'
            );

        /* ========================================================= */
        /* Password Reset Success Message                              */
        /* ========================================================= */

        this.passwordResetSuccessMessage =
            driver.$(
                '~Password Reset Successful'
            );

        /* ========================================================= */
        /* Continue To Login Button                                    */
        /* ========================================================= */

        this.continueToLoginButton =
            driver.$(
                '~Continue to Login'
            );
    }

    /* ========================================================= */
    /* Enter OTP                                                 */
    /* ========================================================= */

    async enterOtp(otp) {

        if (!/^\d{4}$/.test(otp)) {

            throw new Error(
                `Invalid OTP supplied: "${otp}". Expected a 4-digit OTP.`
            );
        }

        const otpInputs = [
            this.otpInput1,
            this.otpInput2,
            this.otpInput3,
            this.otpInput4
        ];

        for (let i = 0; i < otpInputs.length; i++) {

            await otpInputs[i]
                .waitForDisplayed({
                    timeout: 15000
                });

            await otpInputs[i].click();

            await otpInputs[i].clearValue();

            await otpInputs[i].setValue(
                otp[i]
            );
        }

        console.log(
            'OTP entered successfully.'
        );
    }

    /* ========================================================= */
    /* Tap Verify                                                */
    /* ========================================================= */

    async tapVerify() {

        await this.verifyButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.verifyButton.click();
    }

    /* ========================================================= */
    /* Verify OTP Completion                                     */
    /* ========================================================= */

    async verifyVerificationCompleted() {

        await this.verificationCompletedMessage
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'OTP verification completed successfully.'
        );
    }

    /* ========================================================= */
    /* Enter New Password                                        */
    /* ========================================================= */

    async enterNewPassword(password) {

        await this.fillInput(
            this.newPasswordInput,
            password
        );
    }

    /* ========================================================= */
    /* Enter Confirm New Password                                */
    /* ========================================================= */

    async enterConfirmNewPassword(password) {

        await this.fillInput(
            this.confirmNewPasswordInput,
            password
        );
    }

    /* ========================================================= */
    /* Tap Reset Password                                        */
    /* ========================================================= */

    async tapResetPassword() {

        await this.resetPasswordButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.resetPasswordButton.click();
    }

    /* ========================================================= */
    /* Verify Password Reset Success                             */
    /* ========================================================= */

    async verifyPasswordResetSuccessful() {

        await this.passwordResetSuccessMessage
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Password reset successfully.'
        );
    }

    /* ========================================================= */
    /* Tap Continue To Login                                     */
    /* ========================================================= */

    async tapContinueToLogin() {

        await this.continueToLoginButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.continueToLoginButton.click();
    }

    /* ========================================================= */
    /* Fill Input                                                */
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
    ResetPasswordPage
};