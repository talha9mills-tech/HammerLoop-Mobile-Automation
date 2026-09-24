/*************************************************************
 * Page Object: SignUpPage
 * Purpose: Handle Worker and Employer signup form actions.
 *************************************************************/

class SignUpPage {

    constructor(driver) {

        this.driver = driver;

        this.role = 'Worker';

        // NOTE: No longer caching checkbox elements here!
        // Cached elements can become stale when Flutter rebuilds widgets.
        // We'll use getter methods for fresh lookups instead.
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
     * keyboard-hide animation that happens right before we click it —
     * a stale handle keeps its OLD bounds.
     */
    getCreateAccountButton() {

        return this.driver.$(
            'android=new UiSelector().resourceId("create_account_button")'
        );
    }

    /* ========================================================= */
    /* Checkbox Getters - Fresh Lookups Each Time               */
    /* ========================================================= */

    getTermsCheckbox() {

        return this.driver.$(
            'android=new UiSelector().resourceId("terms_checkbox")'
        );
    }

    /* ========================================================= */
    /* Transactional SMS Consent Checkbox                         */
    /* ========================================================= */

    getSmsConsentTransactionalCheckbox() {

        return this.driver.$(
            'android=new UiSelector().resourceId("sms_consent_checkbox_transactional")'
        );
    }

    /* ========================================================= */
    /* Marketing SMS Consent Checkbox                             */
    /* ========================================================= */

    getSmsConsentMarketingCheckbox() {

        return this.driver.$(
            'android=new UiSelector().resourceId("sms_consent_checkbox_marketing")'
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

    async acceptTerms() {

        console.log('Accepting Terms...');
        
        // Get fresh checkbox
        const checkbox = this.getTermsCheckbox();
        
        // Check if already displayed
        if (await checkbox.isDisplayed()) {
            console.log('Terms checkbox is already displayed!');
            await this.clickCheckboxWithDebug(checkbox, 'Terms');
            return;
        }
        
        // If not displayed, scroll and click
        const scrolledCheckbox = await this.scrollCheckboxIntoView('terms_checkbox');
        await this.clickCheckboxWithDebug(scrolledCheckbox, 'Terms');
    }

    /* ========================================================= */
    /* Transactional SMS Consent                                 */
    /* ========================================================= */

    async acceptSmsConsentTransactional() {

        console.log('Accepting Transactional SMS Consent...');

        // Get fresh checkbox
        const checkbox = this.getSmsConsentTransactionalCheckbox();

        // Check if already displayed
        if (await checkbox.isDisplayed()) {
            console.log('Transactional SMS Consent checkbox is already displayed!');
            await this.clickCheckboxWithDebug(checkbox, 'Transactional SMS Consent');
            return;
        }

        // If not displayed, scroll and click
        const scrolledCheckbox = await this.scrollCheckboxIntoView('sms_consent_checkbox_transactional');
        await this.clickCheckboxWithDebug(scrolledCheckbox, 'Transactional SMS Consent');
    }

    /* ========================================================= */
    /* Marketing SMS Consent                                     */
    /* ========================================================= */

    async acceptSmsConsentMarketing() {

        console.log('Accepting Marketing SMS Consent...');

        // Get fresh checkbox
        const checkbox = this.getSmsConsentMarketingCheckbox();

        // Check if already displayed
        if (await checkbox.isDisplayed()) {
            console.log('Marketing SMS Consent checkbox is already displayed!');
            await this.clickCheckboxWithDebug(checkbox, 'Marketing SMS Consent');
            return;
        }

        // If not displayed, scroll and click
        const scrolledCheckbox = await this.scrollCheckboxIntoView('sms_consent_checkbox_marketing');
        await this.clickCheckboxWithDebug(scrolledCheckbox, 'Marketing SMS Consent');
    }

    /**
     * Convenience helper: accepts both SMS consent checkboxes
     * (transactional + marketing) in one call, for flows that always
     * want both checked.
     */
    async acceptAllSmsConsents() {

        await this.acceptSmsConsentTransactional();
        await this.acceptSmsConsentMarketing();
    }

    /* ========================================================= */
    /* Create Account - guarded keyboard hide + scroll fallback  */
    /* ========================================================= */

    async tapCreateAccount() {

        console.log('Attempting to click Create Account button...');

        // NOTE: We do NOT blindly call driver.hideKeyboard() up front.
        // On Android, hideKeyboard() can fall back to pressing BACK when
        // no keyboard is actually shown, which was navigating us away
        // from the form. Instead, inside the retry loop below, we only
        // hide the keyboard if driver.isKeyboardShown() confirms it is
        // really covering the button.

        // Get fresh button
        const button = this.getCreateAccountButton();

        // Wait for button with retry
        let found = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                await button.waitForDisplayed({
                    timeout: 3000,
                    interval: 500
                });
                found = true;
                console.log(`Create Account button found on attempt ${attempt + 1}`);
                break;
            } catch (error) {
                console.log(`Create Account button not found, attempt ${attempt + 1}/5`);

                // Safe, guarded hide: only act if the keyboard is really up.
                // 'mobile: hideKeyboard' is the more reliable UiAutomator2 way
                // to dismiss it - driver.hideKeyboard() alone was not always
                // closing this particular field.
                try {
                    if (await this.driver.isKeyboardShown()) {
                        console.log('Keyboard is covering the Create Account button - hiding it...');

                        try {
                            await this.driver.execute('mobile: hideKeyboard');
                        } catch (mobileHideError) {
                            await this.driver.hideKeyboard();
                        }

                        await this.driver.pause(500);
                    }
                } catch (kbError) {
                    // isKeyboardShown()/hideKeyboard() not supported or failed - ignore.
                }

                // The button can also simply be off-screen (below the fold),
                // independent of the keyboard - e.g. Flutter hasn't rendered
                // it into the accessibility tree yet. Try scrolling it into
                // view the same way we do for the checkboxes.
                try {
                    const scrolledButton = this.driver.$(
                        'android=new UiScrollable(new UiSelector().scrollable(true))' +
                        '.scrollIntoView(new UiSelector().resourceId("create_account_button"))'
                    );

                    await scrolledButton.waitForDisplayed({
                        timeout: 3000
                    });

                    found = true;
                    console.log(`Create Account button found after scrolling, attempt ${attempt + 1}`);
                    break;
                } catch (scrollError) {
                    // Not scrollable, already visible, or still not found - keep retrying.
                }

                await this.driver.pause(500);
            }
        }

        if (!found) {
            // Check if we're still on the signup screen
            const isSignupScreen = await this.driver.$(
                'android=new UiSelector().textContains("Create Account")'
            ).isDisplayed();
            
            if (!isSignupScreen) {
                throw new Error('Navigated away from signup screen before clicking Create Account');
            }
            
            throw new Error('Create Account button not found after multiple attempts');
        }

        // Re-fetch a fresh handle now that we know it's found/displayed -
        // whether we found it via the initial waitForDisplayed or via the
        // scroll fallback, `button` may otherwise point at a stale/never-
        // resolved element.
        const freshButton = this.getCreateAccountButton();

        // Check if button is enabled
        const isEnabled = await freshButton.isEnabled();
        console.log(`Create Account button enabled: ${isEnabled}`);

        if (!isEnabled) {
            throw new Error('Create Account button is displayed but disabled.');
        }

        // Click the button
        await freshButton.click();
        console.log('Create Account button clicked successfully.');
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

    /* ========================================================= */
    /* Click Checkbox with Debug                                 */
    /* ========================================================= */

    async clickCheckboxWithDebug(checkbox, checkboxName) {

        console.log(`Attempting to click ${checkboxName} checkbox...`);

        // Wait for it to be displayed
        await checkbox.waitForDisplayed({
            timeout: 15000
        });

        // Get state before click
        const beforeChecked = await checkbox.getAttribute('checked');
        console.log(`${checkboxName} checked state BEFORE click: ${beforeChecked}`);

        // Perform click
        await checkbox.click();
        console.log(`${checkboxName} checkbox clicked.`);

        // Wait a moment for state to update
        await this.driver.pause(500);

        // Get state after click
        const afterChecked = await checkbox.getAttribute('checked');
        console.log(`${checkboxName} checked state AFTER click: ${afterChecked}`);

        if (beforeChecked === afterChecked) {
            console.warn(`WARNING: ${checkboxName} checkbox state did NOT change!`);
            console.warn(`Before: ${beforeChecked}, After: ${afterChecked}`);
            
            // Try alternative click method - click by coordinates
            console.log(`Attempting alternative click by coordinates for ${checkboxName}...`);
            const location = await checkbox.getLocation();
            const size = await checkbox.getSize();
            const x = location.x + (size.width / 2);
            const y = location.y + (size.height / 2);
            
            await this.driver.touchAction({
                action: 'tap',
                x: x,
                y: y
            });
            
            await this.driver.pause(500);
            const afterCoordClick = await checkbox.getAttribute('checked');
            console.log(`${checkboxName} checked state AFTER coordinate click: ${afterCoordClick}`);
        }
    }

    /* ========================================================= */
    /* Scroll Checkbox Into View                                 */
    /* ========================================================= */

    async scrollCheckboxIntoView(resourceId) {

        console.log(`Scrolling to checkbox with resourceId: ${resourceId}`);

        const checkboxSelector =
            `new UiSelector().resourceId("${resourceId}")`;

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

        console.log(`Successfully scrolled to checkbox: ${resourceId}`);
        
        return checkbox;
    }

    /* ========================================================= */
    /* Backward Compatibility - Deprecated Methods              */
    /* ========================================================= */

    async acceptTermsAndConditions() {
        console.warn('acceptTermsAndConditions() is deprecated. Use acceptTerms() instead.');
        await this.acceptTerms();
    }

    /**
     * Deprecated: the old single SMS consent checkbox was split into
     * two separate checkboxes (transactional + marketing). This now
     * accepts both, for callers that haven't migrated yet.
     */
    async acceptPrivacyPolicy() {
        console.warn('acceptPrivacyPolicy() is deprecated. Use acceptSmsConsentTransactional() and acceptSmsConsentMarketing() instead.');
        await this.acceptAllSmsConsents();
    }
}

module.exports = {
    SignUpPage
};