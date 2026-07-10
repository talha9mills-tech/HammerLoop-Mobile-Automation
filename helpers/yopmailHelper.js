/*************************************************************
 * Helper: Yopmail Helper
 * Purpose: Retrieve the correct HammerLoop OTP from Yopmail
 *          using the current test user's email address.
 *************************************************************/

const { chromium } = require('playwright');

class YopmailHelper {
    constructor() {
        this.browser = null;
        this.page = null;

        this.maxWaitTime = 90000;
        this.pollingInterval = 5000;
    }

    /* ========================================================= */
    /* Retrieve OTP for the Current Test User                    */
    /* ========================================================= */
    async getLatestHammerLoopOtp(
        inboxEmail,
        expectedRecipientEmail
    ) {
        try {
            await this.openInbox(inboxEmail);

            const startTime = Date.now();

            while (
                Date.now() - startTime <
                this.maxWaitTime
            ) {
                console.log(
                    `Checking Yopmail for OTP email sent to: ${expectedRecipientEmail}`
                );

                const otp =
                    await this.tryGetOtpForRecipient(
                        expectedRecipientEmail
                    );

                if (otp) {
                    console.log(
                        `OTP retrieved successfully: ${otp}`
                    );

                    return otp;
                }

                console.log(
                    `OTP was not available yet. Retrying in ${this.pollingInterval / 1000} seconds.`
                );

                await this.page.waitForTimeout(
                    this.pollingInterval
                );

                await this.refreshInbox();
            }

            throw new Error(
                `OTP email for ${expectedRecipientEmail} was not received within ${this.maxWaitTime / 1000} seconds.`
            );
        } finally {
            await this.closeBrowser();
        }
    }

    /* ========================================================= */
    /* Open Yopmail Inbox                                        */
    /* ========================================================= */
    async openInbox(inboxEmail) {
        this.browser = await chromium.launch({
            headless: false
        });

        const context =
            await this.browser.newContext();

        this.page =
            await context.newPage();

        await this.page.goto(
            'https://yopmail.com',
            {
                waitUntil: 'domcontentloaded'
            }
        );

        const emailTextbox =
            this.page.locator('#login');

        await emailTextbox.fill(inboxEmail);
        await emailTextbox.press('Enter');

        await this.page
            .frameLocator('#ifinbox')
            .locator('body')
            .waitFor({
                state: 'visible',
                timeout: 30000
            });

        console.log(
            `Opened Yopmail inbox: ${inboxEmail}`
        );
    }

    /* ========================================================= */
    /* Find Correct Email and Extract OTP                        */
    /* ========================================================= */
    async tryGetOtpForRecipient(expectedRecipientEmail) {
        const openedEmailOtp =
            await this.getOtpFromCurrentlyOpenedEmail(
                expectedRecipientEmail
            );

        if (openedEmailOtp) {
            return openedEmailOtp;
        }

        const inboxFrame =
            this.page.frameLocator('#ifinbox');

        const expectedEmail =
            inboxFrame
                .locator('button.lm')
                .filter({
                    hasText: expectedRecipientEmail
                })
                .first();

        const emailExists =
            await expectedEmail
                .isVisible()
                .catch(() => false);

        if (!emailExists) {
            console.log(
                'Current user email is not visible in Yopmail inbox yet.'
            );

            return null;
        }

        await expectedEmail.click();

        return await this.getOtpFromCurrentlyOpenedEmail(
            expectedRecipientEmail
        );
    }

    /* ========================================================= */
    /* Check Opened Email Subject and Extract Its OTP            */
    /* ========================================================= */
    async getOtpFromCurrentlyOpenedEmail(expectedRecipientEmail) {
        const mailFrame =
            this.page.frameLocator('#ifmail');

        const emailBody =
            mailFrame.locator('body');

        const emailLoaded =
            await emailBody
                .isVisible()
                .catch(() => false);

        if (!emailLoaded) {
            return null;
        }

        const emailContent =
            await emailBody
                .innerText()
                .catch(() => '');

        if (
            !emailContent
                .toLowerCase()
                .includes(
                    expectedRecipientEmail.toLowerCase()
                )
        ) {
            return null;
        }

        const verificationCodeLabel =
            mailFrame
                .locator('p')
                .filter({
                    hasText: /^Verification code$/
                })
                .first();

        const labelExists =
            await verificationCodeLabel
                .isVisible()
                .catch(() => false);

        if (!labelExists) {
            console.log(
                'Correct email is open, but Verification code label is not loaded yet.'
            );

            return null;
        }

        const otpParagraph =
            verificationCodeLabel.locator(
                'xpath=following-sibling::p[1]'
            );

        const otpExists =
            await otpParagraph
                .isVisible()
                .catch(() => false);

        if (!otpExists) {
            console.log(
                'Correct email is open, but OTP paragraph is not loaded yet.'
            );

            return null;
        }

        const otp =
            await otpParagraph.innerText();

        const cleanOtp =
            otp.trim();

        if (!/^\d{4}$/.test(cleanOtp)) {
            console.log(
                `OTP paragraph was found, but it does not contain a valid OTP: "${cleanOtp}"`
            );

            return null;
        }

        return cleanOtp;
    }

    /* ========================================================= */
    /* Refresh Yopmail Inbox                                     */
    /* ========================================================= */
    async refreshInbox() {
        const refreshButton =
            this.page.locator('#refresh');

        const isRefreshButtonVisible =
            await refreshButton
                .isVisible()
                .catch(() => false);

        if (isRefreshButtonVisible) {
            await refreshButton.click();

            await this.page.waitForTimeout(1000);

            return;
        }

        await this.page.reload({
            waitUntil: 'domcontentloaded'
        });

        await this.page.waitForTimeout(1000);
    }

    /* ========================================================= */
    /* Close Browser                                             */
    /* ========================================================= */
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();

            this.browser = null;
            this.page = null;
        }
    }
}

module.exports = {
    YopmailHelper
};