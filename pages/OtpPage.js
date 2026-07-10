/*************************************************************
 * Page Object: OTP Verification Page
 * Purpose: Handle OTP entry and verification actions.
 *************************************************************/

class OtpPage {
    constructor(driver) {
        this.driver = driver;

        this.otpDigit1Input = driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(0)'
        );

        this.otpDigit2Input = driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(1)'
        );

        this.otpDigit3Input = driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(2)'
        );

        this.otpDigit4Input = driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(3)'
        );

        this.verifyButton =
            driver.$('~Verify');

        this.findJobButton =
            driver.$('~Find Job');
    }

    async waitForOtpScreen() {
        await this.otpDigit1Input.waitForDisplayed({
            timeout: 20000
        });

        await this.verifyButton.waitForDisplayed({
            timeout: 20000
        });
    }

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

        for (let index = 0; index < otpInputs.length; index += 1) {
            await otpInputs[index].waitForDisplayed({
                timeout: 15000
            });

            await otpInputs[index].click();

            await otpInputs[index].setValue(
                otpDigits[index]
            );
        }
    }

    async tapVerify() {
        await this.verifyButton.waitForDisplayed({
            timeout: 15000
        });

        await this.verifyButton.click();
    }

    async verifyFindJobButtonIsVisible() {
        await this.findJobButton.waitForDisplayed({
            timeout: 30000
        });
    }
}

module.exports = {
    OtpPage
};