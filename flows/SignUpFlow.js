/*************************************************************
 * Flow: Sign Up Flow
 * Purpose: Complete Worker or Employer signup,
 * save created user, retrieve OTP,
 * verify account and continue onboarding.
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
    SignUpPage
} = require('../pages/SignUpPage');

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

const {
    EmployerOnboardingFlow
} = require('./EmployerOnboardingFlow');

class SignUpFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.authSelectionPage =
            new AuthSelectionPage(driver);

        this.roleSelectionPage =
            new RoleSelectionPage(driver);

        this.signUpPage =
            new SignUpPage(driver);

        this.otpPage =
            new OtpPage(driver);

        this.yopmailHelper =
            new YopmailHelper();
    }

    /* ========================================================= */
    /* Create Account                                            */
    /* ========================================================= */

    async createAccount(
        user,
        role = 'Worker'
    ) {

        /* ===================================================== */
        /* STEP 1: Open Signup Journey                           */
        /* ===================================================== */

        await this.welcomePage.tapGetStarted();

        await this.authSelectionPage.tapSignUp();

        /* ===================================================== */
        /* STEP 2: Select Role                                   */
        /* ===================================================== */

        if (role === 'Worker') {

            await this.roleSelectionPage
                .selectWorkerRole();
            await this.signUpPage.setRole('Worker');

        } else {

            await this.roleSelectionPage
                .selectEmployerRole();
                await this.signUpPage.setRole('Employer');
        }

        await this.roleSelectionPage
            .tapContinue();

        /* ===================================================== */
        /* STEP 3: Fill Signup Form                              */
        /* ===================================================== */

        await this.signUpPage.enterFullName(
            user.fullName
        );

        if (role === 'Employer') {

            await this.signUpPage.enterCompanyName(
                user.companyName
            );
        }

        await this.signUpPage.enterEmail(
            user.email
        );

        await this.signUpPage.enterPhoneNumber(
            user.phone
        );

        await this.signUpPage.enterPassword(
            user.password
        );

        await this.signUpPage.enterConfirmPassword(
            user.password
        );

        // UPDATED: Method names changed to match new checkbox locators
        await this.signUpPage
            .acceptTerms();           

        await this.signUpPage.acceptSmsConsentTransactional();
        await this.signUpPage.acceptSmsConsentMarketing();    

        /* ===================================================== */
        /* STEP 4: Submit Signup                                 */
        /* ===================================================== */

        await this.signUpPage
            .tapCreateAccount();

        await this.otpPage
            .waitForOtpScreen();

        console.log(
            'Create Account was accepted. OTP verification screen is visible.'
        );

        /* ===================================================== */
        /* STEP 5: Save User                                     */
        /* ===================================================== */

        user.environment =
            environment.testEnvironment;

        user.role =
            role;

        saveUser(user);

        /* ===================================================== */
        /* STEP 6: Retrieve OTP                                  */
        /* ===================================================== */

        const inbox =

            environment.testEnvironment === 'staging'

                ? 'hammerloop@yopmail.com'

                : user.email;

        console.log(
            `Retrieving OTP for ${role}...`
        );

        const otp =
            await this.yopmailHelper
                .getLatestHammerLoopOtp(
                    inbox,
                    user.email
                );

        /* ===================================================== */
        /* STEP 7: Verify OTP                                    */
        /* ===================================================== */

        await this.otpPage
            .enterOtp(otp);

        await this.otpPage
            .tapVerify();

        if (role === 'Worker') {

            await this.otpPage
                .verifyFindJobButtonIsVisible();

            console.log(
                'Worker signup completed successfully.'
            );

        } else {

            await this.otpPage
                .verifyAddJobButtonIsVisible();

            console.log(
                'Employer signup completed successfully.'
            );
        }

        /* ===================================================== */
        /* STEP 8: Complete Onboarding                           */
        /* ===================================================== */

        if (role === 'Worker') {

            const workerOnboardingFlow =
                new WorkerOnboardingFlow(
                    this.driver
                );

            await workerOnboardingFlow
                .completeWorkerProfile();

        } else {

            const employerOnboardingFlow =
                new EmployerOnboardingFlow(
                    this.driver
                );

            await employerOnboardingFlow
                .completeEmployerProfile();
        }
    }
}

module.exports = {
    SignUpFlow
};