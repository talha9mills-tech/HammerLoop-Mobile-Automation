/*************************************************************
 * Flow: Worker Signup Flow
 * Purpose: Complete Worker signup, save created user,
 *          retrieve OTP, and verify the account.
 *************************************************************/

const environment =
    require('../config/environment');

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    AuthSelectionPage
} = require('../pages/AuthSelectionPage');

const {
    RoleSelectionPage
} = require('../pages/RoleSelectionPage');

const {
    WorkerSignupPage
} = require('../pages/WorkerSignupPage');

const {
    OtpPage
} = require('../pages/OtpPage');

const {
    YopmailHelper
} = require('../helpers/yopmailHelper');

const {
    saveUser
} = require('../utils/userRegistry');

const {
    WorkerOnboardingFlow
} = require('./WorkerOnboardingFlow');

class WorkerSignupFlow {
    constructor(driver) {
        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.authSelectionPage =
            new AuthSelectionPage(driver);

        this.roleSelectionPage =
            new RoleSelectionPage(driver);

        this.workerSignupPage =
            new WorkerSignupPage(driver);

        this.otpPage =
            new OtpPage(driver);

        this.yopmailHelper =
            new YopmailHelper();
    }

    async createWorkerAccount(user) {
        /* =================================================== */
        /* STEP 1: Open Worker Signup Journey                 */
        /* =================================================== */
        await this.welcomePage.tapGetStarted();

        await this.authSelectionPage.tapSignUp();

        await this.roleSelectionPage.selectWorkerRole();

        await this.roleSelectionPage.tapContinue();

        /* =================================================== */
        /* STEP 2: Complete Worker Signup Form                */
        /* =================================================== */
        await this.workerSignupPage.enterFullName(
            user.fullName
        );

        await this.workerSignupPage.enterEmail(
            user.email
        );

        await this.workerSignupPage.enterPhoneNumber(
            user.phone
        );

        await this.workerSignupPage.enterPassword(
            user.password
        );

        await this.workerSignupPage.enterConfirmPassword(
            user.password
        );

        await this.workerSignupPage.acceptTermsAndConditions();

        await this.workerSignupPage.acceptPrivacyPolicy();

        /* =================================================== */
        /* STEP 3: Submit Form and Confirm OTP Screen         */
        /* =================================================== */
        await this.workerSignupPage.tapCreateAccount();

        await this.otpPage.waitForOtpScreen();

        console.log(
            'Create Account was accepted. OTP verification screen is visible.'
        );

        /* =================================================== */
        /* STEP 4: Save Confirmed Worker Account              */
        /* =================================================== */
        user.environment =
            environment.testEnvironment;

        saveUser(user);

        /* =================================================== */
        /* STEP 5: Retrieve OTP from Yopmail                  */
        /* =================================================== */
        console.log(
            'Worker account saved. Retrieving OTP from Yopmail.'
        );

        const otpInbox =
            environment.testEnvironment === 'staging'
                ? 'hammerloop@yopmail.com'
                : user.email;

        const otp =
            await this.yopmailHelper.getLatestHammerLoopOtp(
                otpInbox,
                user.email
            );

        /* =================================================== */
        /* STEP 6: Verify OTP                                 */
        /* =================================================== */
        await this.otpPage.enterOtp(otp);

        await this.otpPage.tapVerify();

        await this.otpPage.verifyFindJobButtonIsVisible();

        console.log(
            'Worker signup and OTP verification completed successfully.'
        );

        /* ======================================================= */
        /* STEP 7: Complete Worker Profile                         */
        /* ======================================================= */

        const workerOnboardingFlow =
            new WorkerOnboardingFlow(this.driver);

        await workerOnboardingFlow
            .completeWorkerProfile();
            }
}

module.exports = {
    WorkerSignupFlow
};