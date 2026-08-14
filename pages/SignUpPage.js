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

        this.createAccountButton =
            driver.$(
                'android=new UiSelector().resourceId("create_account_button")'
            );
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
        // 🔥 FIX: Hide keyboard first
        try {
            await this.driver.hideKeyboard();
            console.log('Keyboard hidden before scrolling.');
            await this.driver.pause(1000);
        } catch (e) {
            console.log('No keyboard to hide.');
        }

        // 🔥 FIX: Scroll to button using the button's resource ID
        await this.scrollCreateAccountButtonIntoView();

        // 🔥 FIX: Wait for button to be displayed
        await this.createAccountButton.waitForDisplayed({
            timeout: 15000
        });

        // 🔥 FIX: Check if button is enabled
        const isEnabled = await this.createAccountButton.isEnabled();
        console.log(`Create Account button enabled: ${isEnabled}`);

        if (!isEnabled) {
            throw new Error('Create Account button is displayed but disabled.');
        }

        // 🔥 FIX: Try multiple click methods
        try {
            await this.createAccountButton.click();
            console.log('Create Account button clicked.');
        } catch (error) {
            console.log('Standard click failed, trying coordinate tap...');
            
            const location = await this.createAccountButton.getLocation();
            const size = await this.createAccountButton.getSize();
            
            const centerX = Math.floor(location.x + (size.width / 2));
            const centerY = Math.floor(location.y + (size.height / 2));
            
            await this.driver.touchAction([
                { action: 'tap', x: centerX, y: centerY }
            ]);
            console.log('Coordinate tap executed.');
        }
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

    async scrollCreateAccountButtonIntoView() {
        // 🔥 FIX: Use UiScrollable with resourceId
        const scrollableSelector =
            'new UiScrollable(' +
            'new UiSelector()' +
            '.scrollable(true)' +
            ')' +
            '.scrollIntoView(' +
            'new UiSelector()' +
            '.resourceId("create_account_button")' +
            ')';

        try {
            const button = await this.driver.$(`android=${scrollableSelector}`);
            await button.waitForDisplayed({ timeout: 10000 });
            console.log('Scrolled to Create Account button.');
        } catch (error) {
            console.log('Scroll failed, trying alternative scroll method...');
            
            // 🔥 Alternative: Scroll down manually using touch action
            const windowSize = await this.driver.getWindowSize();
            const startX = Math.floor(windowSize.width / 2);
            const startY = Math.floor(windowSize.height * 0.8);
            const endY = Math.floor(windowSize.height * 0.2);
            
            await this.driver.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'moveTo', x: startX, y: endY },
                { action: 'release' }
            ]);
            console.log('Manual scroll executed.');
            await this.driver.pause(1000);
        }
    }
}

module.exports = {
    SignUpPage
};