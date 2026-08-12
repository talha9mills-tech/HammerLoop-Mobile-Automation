/*************************************************************
 * Flow: Employer Password Flow
 * Purpose: Change the Employer password, log out, recover
 *          the account through Forgot Password, verify the
 *          OTP, and reset the password back to its original
 *          value.
 *************************************************************/

const environment =
    require('../config/environment');

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    LoginFlow
} = require('./LoginFlow');

const {
    ProfilePage
} = require('../pages/ProfilePage');

const {
    ProfileSettingsPage
} = require('../pages/ProfileSettingsPage');

const {
    ChangePasswordPage
} = require('../pages/ChangePasswordPage');

const {
    ForgotPasswordPage
} = require('../pages/ForgotPasswordPage');

const {
    ResetPasswordPage
} = require('../pages/ResetPasswordPage');

const {
    EmployerDashboardPage
} = require('../pages/EmployerDashboardPage');

const {
    YopmailHelper
} = require('../helpers/yopmailHelper');

class EmployerPasswordFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        /* ========================================================= */
        /* Existing Login Flow                                       */
        /* ========================================================= */

        this.loginFlow =
            new LoginFlow(driver);

        /* ========================================================= */
        /* Page Objects                                               */
        /* ========================================================= */

        this.profilePage =
            new ProfilePage(driver);

        this.profileSettingsPage =
            new ProfileSettingsPage(driver);

        this.changePasswordPage =
            new ChangePasswordPage(driver);

        this.forgotPasswordPage =
            new ForgotPasswordPage(driver);

        this.resetPasswordPage =
            new ResetPasswordPage(driver);

        this.employerDashboardPage =
            new EmployerDashboardPage(driver);

        /* ========================================================= */
        /* OTP Helper                                                 */
        /* ========================================================= */

        this.yopmailHelper =
            new YopmailHelper();
    }

    /* ========================================================= */
    /* Complete Employer Password Flow                            */
    /* ========================================================= */

    async changeAndResetEmployerPassword() {

        console.log(
            'Starting Employer Password Flow...'
        );

        /* ========================================================= */
        /* Welcome Screen                                            */
        /* ========================================================= */

        console.log(
            'Opening login screen...'
        );

        await this.welcomePage
            .tapGetStarted();

        /* ========================================================= */
        /* Step 1: Login as Employer                                */
        /* ========================================================= */

        await this.loginFlow
            .loginEmployer();

        console.log(
            'Employer login completed.'
        );

        /* ========================================================= */
        /* Step 2: Open Profile                                      */
        /* ========================================================= */

        await this.profilePage
            .tapProfile();

        /* ========================================================= */
        /* Step 3: Open Profile Settings                             */
        /* ========================================================= */

        await this.profilePage
            .tapProfileSettings();

        /* ========================================================= */
        /* Step 4: Open Change Password                              */
        /* ========================================================= */

        await this.profileSettingsPage
            .tapChangePassword();

        /* ========================================================= */
        /* Step 5: Verify Change Password Screen                     */
        /* ========================================================= */

        await this.changePasswordPage
            .verifyChangePasswordScreen();

        /* ========================================================= */
        /* Step 6: Enter Current Password                            */
        /* ========================================================= */

        await this.changePasswordPage
            .enterCurrentPassword(
                environment.employerPassword
            );

        /* ========================================================= */
        /* Step 7: Enter New Password                                */
        /* ========================================================= */

        await this.changePasswordPage
            .enterNewPassword(
                environment.employerChangedPassword
            );

        /* ========================================================= */
        /* Step 8: Confirm New Password                              */
        /* ========================================================= */

        await this.changePasswordPage
            .enterConfirmNewPassword(
                environment.employerChangedPassword
            );

        /* ========================================================= */
        /* Step 9: Change Password                                   */
        /* ========================================================= */

        await this.changePasswordPage
            .tapChangePassword();

        /* ========================================================= */
        /* Step 10: Verify Password Updated                          */
        /* ========================================================= */

        await this.changePasswordPage
            .verifyPasswordUpdated();

        /* ========================================================= */
        /* Step 11: Go Back To Profile Settings                       */
        /* ========================================================= */

        await this.changePasswordPage
            .tapBack();

        /* ========================================================= */
        /* Step 12: Verify Profile Settings                           */
        /* ========================================================= */

        await this.changePasswordPage
            .verifyChangeLanguageVisible();

        /* ========================================================= */
        /* Step 13: Go Back To Profile                                */
        /* ========================================================= */

        await this.changePasswordPage
            .tapBack();

        /* ========================================================= */
        /* Step 14: Navigate To Dashboard                             */
        /* ========================================================= */

        await this.navigateToDashboard();

        /* ========================================================= */
        /* Step 15: Open Profile Menu                                 */
        /* ========================================================= */

        await this.openProfileMenu();

        /* ========================================================= */
        /* Step 16: Logout                                            */
        /* ========================================================= */

        await this.logout();

        /* ========================================================= */
        /* Step 17: Verify Forgot Password                            */
        /* ========================================================= */

        await this.forgotPasswordPage
            .verifyForgotPasswordVisible();

        /* ========================================================= */
        /* Step 18: Open Forgot Password                              */
        /* ========================================================= */

        await this.forgotPasswordPage
            .tapForgotPassword();

        /* ========================================================= */
        /* Step 19: Verify Reset Password Screen                       */
        /* ========================================================= */

        await this.forgotPasswordPage
            .verifyResetPasswordScreen();

        /* ========================================================= */
        /* Step 20: Enter Employer Email                              */
        /* ========================================================= */

        await this.forgotPasswordPage
            .enterResetPasswordEmail(
                environment.employerEmail
            );

        /* ========================================================= */
        /* Step 21: Send Reset Request                                */
        /* ========================================================= */

        await this.forgotPasswordPage
            .tapSend();

        /* ========================================================= */
        /* Step 22: Verify Email Message                              */
        /* ========================================================= */

        await this.forgotPasswordPage
            .verifyCheckEmailMessage();

        /* ========================================================= */
        /* Step 23: Retrieve OTP                                     */
        /* ========================================================= */

        const otp =
            await this.getPasswordResetOtp();

        /* ========================================================= */
        /* Step 24: Enter OTP                                        */
        /* ========================================================= */

        await this.resetPasswordPage
            .enterOtp(otp);

        /* ========================================================= */
        /* Step 25: Verify OTP                                       */
        /* ========================================================= */

        await this.resetPasswordPage
            .tapVerify();

        /* ========================================================= */
        /* Step 26: Verify OTP Completion                             */
        /* ========================================================= */

        await this.resetPasswordPage
            .verifyVerificationCompleted();

        /* ========================================================= */
        /* Step 27: Enter Original Password                           */
        /* ========================================================= */

        await this.resetPasswordPage
            .enterNewPassword(
                environment.employerPassword
            );

        /* ========================================================= */
        /* Step 28: Confirm Original Password                         */
        /* ========================================================= */

        await this.resetPasswordPage
            .enterConfirmNewPassword(
                environment.employerPassword
            );

        /* ========================================================= */
        /* Step 29: Reset Password                                    */
        /* ========================================================= */

        await this.resetPasswordPage
            .tapResetPassword();

        /* ========================================================= */
        /* Step 30: Verify Password Reset                             */
        /* ========================================================= */

        await this.resetPasswordPage
            .verifyPasswordResetSuccessful();

        /* ========================================================= */
        /* Step 31: Continue To Login                                 */
        /* ========================================================= */

        await this.resetPasswordPage
            .tapContinueToLogin();

        console.log(
            'Employer Password Flow completed successfully.'
        );
    }

    /* ========================================================= */
    /* Navigate To Dashboard                                     */
    /* ========================================================= */

    async navigateToDashboard() {

        const dashboardButton =
            this.driver.$(
                '~Dashboard'
            );

        await dashboardButton
            .waitForDisplayed({
                timeout: 15000
            });

        await dashboardButton.click();

        console.log(
            'Navigated to Dashboard.'
        );
    }

    /* ========================================================= */
    /* Open Profile Menu                                         */
    /* ========================================================= */

    async openProfileMenu() {

        const imageView =
            this.driver.$(
                'android=new UiSelector().className("android.widget.ImageView")'
            );

        await imageView
            .waitForDisplayed({
                timeout: 15000
            });

        await imageView.click();

        console.log(
            'Profile menu opened.'
        );
    }

    /* ========================================================= */
    /* Logout                                                    */
    /* ========================================================= */

    async logout() {

        const logoutButton =
            this.driver.$(
                '~Logout'
            );

        await logoutButton
            .waitForDisplayed({
                timeout: 15000
            });

        await logoutButton.click();

        console.log(
            'Employer logged out successfully.'
        );
    }

    /* ========================================================= */
    /* Get Password Reset OTP                                    */
    /* ========================================================= */

    async getPasswordResetOtp() {

        console.log(
            'Retrieving password reset OTP...'
        );

        const environmentName =
            environment.testEnvironment;

        console.log(
            `Current test environment: ${environmentName}`
        );

        if (
            environmentName === 'staging'
        ) {

            console.log(
                'Staging environment detected. Retrieving OTP from Yopmail.'
            );

            return await this.yopmailHelper
                .getLatestHammerLoopOtp(
                    environment.employerEmail,
                    environment.employerEmail
                );
        }

        console.log(
            'Production environment detected. Retrieving OTP from employer email.'
        );

        return await this.yopmailHelper
            .getLatestHammerLoopOtp(
                environment.employerEmail,
                environment.employerEmail
            );
    }
}

module.exports = {
    EmployerPasswordFlow
};