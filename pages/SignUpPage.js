/*************************************************************
 * Page Object: SignUpPage
 * Purpose: Handle Worker and Employer signup form actions.
 *************************************************************/

class SignUpPage {

    constructor(driver) {

        this.driver = driver;

        this.role = 'Worker';

        this.termsAndConditionsCheckbox =
            driver.$(
                'android=new UiSelector().className("android.widget.CheckBox").instance(0)'
            );

        this.privacyPolicyCheckbox =
            driver.$(
                'android=new UiSelector().className("android.widget.CheckBox").instance(1)'
            );

        // NOTE: no longer cached here — see getCreateAccountButton().
        // A cached handle can point at stale coordinates after the
        // keyboard-hide / scroll animations shift the layout, which was
        // causing clicks to land on the wrong widget (e.g. the back
        // button) instead of this one.
    }

    /* ========================================================= */
    /* Role                                                      */
    /* ========================================================= */

    setRole(role) {

        this.role = role;
    }

    getInput(index) {

        return this.driver.$(
            `android=new UiSelector().className("android.widget.EditText").instance(${index})`
        );
    }

    get fullNameInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("full_name_field")'
        );
    }

    get companyNameInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("company_name_field")'
        );
    }

    get emailInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("email_field")'
        );
    }

    get phoneNumberInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("phone_number_field")'
        );
    }

    get passwordInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("password_field")'
        );
    }

    get confirmPasswordInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("confirm_password_field")'
        );
    }

    /**
     * Deliberately a fresh lookup on every call, not a cached property.
     * The button can be disposed/recreated by Flutter during the
     * keyboard-hide and scroll animations that happen right before we
     * click it — a stale handle keeps its OLD bounds, which is what
     * caused the click to land off-target and trigger back navigation.
     */
    getCreateAccountButton() {

        return this.driver.$(
            'android=new UiSelector().resourceId("create_account_button")'
        );
    }

    /* ========================================================= */
    /* Full Name                                                 */
    /* ========================================================= */

    async enterFullName(fullName) {

        await this.fillInput(
            this.fullNameInput,
            fullName
        );
    }

    /* ========================================================= */
    /* Company Name                                              */
    /* ========================================================= */

    async enterCompanyName(companyName) {

        await this.fillInput(
            this.companyNameInput,
            companyName
        );
    }

    /* ========================================================= */
    /* Email                                                     */
    /* ========================================================= */

    async enterEmail(email) {

        await this.fillInput(
            this.emailInput,
            email
        );
    }

    /* ========================================================= */
    /* Phone                                                     */
    /* ========================================================= */

    async enterPhoneNumber(phoneNumber) {

        await this.fillInput(
            this.phoneNumberInput,
            phoneNumber
        );
    }

    /* ========================================================= */
    /* Password                                                  */
    /* ========================================================= */

    async enterPassword(password) {

        await this.fillInput(
            this.passwordInput,
            password
        );
    }

    /* ========================================================= */
    /* Confirm Password                                          */
    /* ========================================================= */

    async enterConfirmPassword(password) {

        await this.fillInput(
            this.confirmPasswordInput,
            password
        );
    }

    /* ========================================================= */
    /* Terms                                                     */
    /* ========================================================= */

    async acceptTermsAndConditions() {

        await this.scrollCheckboxIntoView(0);

        await this.clickCheckbox(
            this.termsAndConditionsCheckbox,
            'Terms and Conditions'
        );
    }

    /* ========================================================= */
    /* Privacy                                                   */
    /* ========================================================= */

    async acceptPrivacyPolicy() {

        await this.scrollCheckboxIntoView(1);

        await this.clickCheckbox(
            this.privacyPolicyCheckbox,
            'Privacy Policy'
        );
    }

    /* ========================================================= */
    /* Create Account                                            */
    /* ========================================================= */

    async tapCreateAccount() {

        try {
            await this.driver.hideKeyboard();
            console.log('Keyboard hidden before scrolling.');
        } catch {
            console.log('No keyboard to hide.');
        }

        // Let the keyboard-close animation fully settle before touching
        // the layout again.
        await this.driver.pause(800);

        await this.scrollCreateAccountButtonIntoView();

        // Let the scroll animation fully settle before locating/clicking
        // the button — clicking mid-animation is what was landing on a
        // stale position.
        await this.driver.pause(500);

        // Fresh lookup — see getCreateAccountButton() comment.
        const button = this.getCreateAccountButton();

        await button.waitForDisplayed({ timeout: 15000 });

        const isEnabled = await button.isEnabled();
        console.log(`Create Account button enabled: ${isEnabled}`);

        if (!isEnabled) {
            throw new Error('Create Account button is displayed but disabled.');
        }

        await button.click();
        console.log('Create Account button clicked.');
    }

    /* ========================================================= */
    /* Helpers                                                   */
    /* ========================================================= */

    async fillInput(input, value) {

        try {

            await input.waitForDisplayed({
                timeout: 3000
            });

        } catch {

            /* Field is likely below the keyboard.
            Hide the keyboard and try again. */

            try {

                await this.driver.hideKeyboard();

            } catch {

                // Keyboard was already hidden.
            }

            await input.waitForDisplayed({
                timeout: 15000
            });
        }

        try {

            await input.scrollIntoView();

        } catch {

            // Ignore if the driver doesn't support it.
        }

        await input.click();

        await input.clearValue();

        await input.setValue(String(value));
    }

    async clickCheckbox(checkbox, checkboxName) {

        await checkbox.waitForDisplayed({
            timeout: 15000
        });

        await checkbox.click();

        console.log(
            `${checkboxName} checkbox clicked.`
        );
    }

    async scrollCheckboxIntoView(instanceNumber) {

        const checkboxSelector =
            'new UiSelector()' +
            '.className("android.widget.CheckBox")' +
            `.instance(${instanceNumber})`;

        const scrollableSelector =
            'new UiScrollable(' +
            'new UiSelector()' +
            '.className("android.widget.ScrollView")' +
            ')' +
            `.scrollIntoView(${checkboxSelector})`;

        const checkbox =
            this.driver.$(
                `android=${scrollableSelector}`
            );

        await checkbox.waitForDisplayed({
            timeout: 15000
        });
    }

    /**
     * Uses Appium's "mobile: scrollGesture" instead of
     * UiScrollable(scrollable(true)) — Flutter apps don't expose a
     * native "scrollable" attribute on their semantics tree, so that
     * selector never matched anything and this method was silently
     * falling through to a large manual swipe (80% -> 20% of screen
     * height) on every single call, which was likely overshooting past
     * the button.
     *
     * mobile: scrollGesture works purely off screen coordinates, so it
     * doesn't depend on that attribute at all.
     */
    async scrollCreateAccountButtonIntoView() {

        const windowSize = await this.driver.getWindowSize();

        try {

            await this.driver.execute('mobile: scrollGesture', {
                left: 0,
                top: Math.floor(windowSize.height * 0.2),
                width: windowSize.width,
                height: Math.floor(windowSize.height * 0.6),
                direction: 'down',
                percent: 0.75
            });

            console.log('Scrolled toward Create Account button.');

        } catch (error) {

            console.log(`mobile: scrollGesture failed (${error.message}), trying manual swipe...`);

            const startX = Math.floor(windowSize.width / 2);
            const startY = Math.floor(windowSize.height * 0.75);
            const endY = Math.floor(windowSize.height * 0.35);

            await this.driver.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'moveTo', x: startX, y: endY },
                { action: 'release' }
            ]);

            console.log('Manual scroll executed.');
        }
    }
}

module.exports = {
    SignUpPage
};