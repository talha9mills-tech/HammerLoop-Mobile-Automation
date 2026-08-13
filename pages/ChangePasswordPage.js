/*************************************************************
 * Page Object: Change Password Page
 * Purpose: Handle change password screen actions and
 *          validations.
 *************************************************************/

class ChangePasswordPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Change Password Description                                */
        /* ========================================================= */

        this.changePasswordDescription =
            driver.$(
                '~Update your password here.'
            );

        /* ========================================================= */
        /* Current Password Input                                     */
        /* ========================================================= */

        this.currentPasswordInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        /* ========================================================= */
        /* New Password Input                                          */
        /* ========================================================= */

        this.newPasswordInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        /* ========================================================= */
        /* Confirm New Password Input                                  */
        /* ========================================================= */

        this.confirmNewPasswordInput =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(2)'
            );

        /* ========================================================= */
        /* Change Password Button                                      */
        /* ========================================================= */

        this.changePasswordButton =
            driver.$(
                'android=new UiSelector().className("android.widget.Button").description("Change Password")'
            );

        /* ========================================================= */
        /* Password Updated Success Message                            */
        /* ========================================================= */

        this.passwordUpdatedSuccessMessage =
            driver.$(
                '~Password Updated Successfully'
            );

        /* ========================================================= */
        /* Back Button / First View Element                             */
        /* ========================================================= */

        this.firstViewElement =
            driver.$(
                '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]'
            );

        /* ========================================================= */
        /* Change Language Button                                      */
        /* ========================================================= */

        this.changeLanguageButton =
            driver.$(
                '~Change Language'
            );
    }

    /* ========================================================= */
    /* Verify Change Password Screen                              */
    /* ========================================================= */

    async verifyChangePasswordScreen() {

        await this.changePasswordDescription
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Change Password screen is visible.'
        );
    }

    /* ========================================================= */
    /* Enter Current Password                                     */
    /* ========================================================= */

    async enterCurrentPassword(password) {

        await this.fillInput(
            this.currentPasswordInput,
            password
        );
    }

    /* ========================================================= */
    /* Enter New Password                                         */
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
    /* Tap Change Password                                        */
    /* ========================================================= */

    async tapChangePassword() {

        await this.changePasswordButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.changePasswordButton.click();
    }

    /* ========================================================= */
    /* Verify Password Updated                                    */
    /* ========================================================= */

    async verifyPasswordUpdated() {

        await this.passwordUpdatedSuccessMessage
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Password updated successfully.'
        );
        await this.driver.pause(2000);
    }

    /* ========================================================= */
    /* Tap Back                                                   */
    /* ========================================================= */

    async tapBack() {

        await this.firstViewElement
            .waitForDisplayed({
                timeout: 15000
            });

        await this.firstViewElement.click();
    }

    /* ========================================================= */
    /* Verify Change Language                                    */
    /* ========================================================= */

    async verifyChangeLanguageVisible() {

        await this.changeLanguageButton
            .waitForDisplayed({
                timeout: 150
            });

        console.log(
            'Profile Settings screen is visible.'
        );
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

        await input.setValue(
            String(value)
        );
    }
    }

module.exports = {
    ChangePasswordPage
};