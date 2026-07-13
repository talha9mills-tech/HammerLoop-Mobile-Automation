/*************************************************************
 * Page Object: OTP Verification Page
 * Purpose: Handle OTP entry and verification actions.
 *************************************************************/

class OtpPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* OTP Inputs                                                */
        /* ========================================================= */

        this.otpDigit1Input =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(0)'
            );

        this.otpDigit2Input =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(1)'
            );

        this.otpDigit3Input =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(2)'
            );

        this.otpDigit4Input =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText").instance(3)'
            );

        /* ========================================================= */
        /* Verify Button                                             */
        /* ========================================================= */

        this.verifyButton =
            driver.$(
                '~Verify'
            );

        /* ========================================================= */
        /* Worker Dashboard                                          */
        /* ========================================================= */

        this.findJobButton =
            driver.$(
                '~Find Job'
            );

        /* ========================================================= */
        /* Employer Dashboard                                        */
        /* ========================================================= */

        this.addJobButton =
            driver.$(
                '~Add Job'
            );
    }

    /* ========================================================= */
    /* Wait For OTP Screen                                        */
    /* ========================================================= */

    async waitForOtpScreen() {

        await this.otpDigit1Input.waitForDisplayed({
            timeout: 20000
        });

        await this.verifyButton.waitForDisplayed({
            timeout: 20000
        });
    }

    /* ========================================================= */
    /* Enter OTP                                                  */
    /* ========================================================= */

    async enterOtp(otp) {

        if (!/^\d{4}$/.test(otp)) {

            throw new Error(
                'OTP must contain exactly four digits.'
            );
        }

        const otpDigits =
            otp.split('');

        const otpInputs = [

            this.otpDigit1Input,

            this.otpDigit2Input,

            this.otpDigit3Input,

            this.otpDigit4Input
        ];

        for (
            let index = 0;
            index < otpInputs.length;
            index += 1
        ) {

            await otpInputs[index].waitForDisplayed({
                timeout: 15000
            });

            await otpInputs[index].click();

            await otpInputs[index].setValue(
                otpDigits[index]
            );
        }
    }

    /* ========================================================= */
    /* Tap Verify                                                 */
    /* ========================================================= */

    async tapVerify() {

        await this.verifyButton.waitForDisplayed({
            timeout: 15000
        });

        await this.verifyButton.click();
    }

    /* ========================================================= */
    /* Verify Worker Dashboard                                   */
    /* ========================================================= */

    async verifyFindJobButtonIsVisible() {

        await this.findJobButton.waitForDisplayed({
            timeout: 30000
        });

        return await this.findJobButton.isDisplayed();
    }

    /* ========================================================= */
    /* Verify Employer Dashboard                                 */
    /* ========================================================= */

    async verifyAddJobButtonIsVisible() {

        await this.addJobButton.waitForDisplayed({
            timeout: 30000
        });

        return await this.addJobButton.isDisplayed();
    }
}

module.exports = {
    OtpPage
};