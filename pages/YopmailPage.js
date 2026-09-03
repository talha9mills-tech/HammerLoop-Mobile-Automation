/*************************************************************
 * Page Object: Yopmail Page
 * Purpose: Retrieve HammerLoop OTP from Yopmail inbox.
 *************************************************************/

class YopmailPage {

  constructor(browser) {

    this.browser = browser;
  }

  /* ========================================================= */
  /* Open Yopmail Website                                      */
  /* ========================================================= */

  async open() {

    await this.browser.url(
      'https://yopmail.com'
    );
  }

  /* ========================================================= */
  /* Open Inbox By Email Prefix                                */
  /* ========================================================= */

  async openInbox(inboxName) {

    const inboxInput =
      await this.browser.$(
        'input#login'
      );

    await inboxInput.waitForDisplayed({
      timeout: 15000
    });

    await inboxInput.setValue(
      inboxName
    );

    const checkInboxButton =
      await this.browser.$(
        'button[onclick="onLogin();"]'
      );

    await checkInboxButton.waitForDisplayed({
      timeout: 15000
    });

    await checkInboxButton.click();
  }

  /* ========================================================= */
  /* Open Latest HammerLoop Email                              */
  /* ========================================================= */

  async openLatestHammerLoopEmail() {

    const mailFrame =
      await this.browser.$(
        'iframe#ifmail'
      );

    await mailFrame.waitForExist({
      timeout: 20000
    });

    await this.browser.switchToFrame(
      mailFrame
    );

    const latestEmail =
      await this.browser.$(
        'div.m'
      );

    await latestEmail.waitForDisplayed({
      timeout: 20000
    });

    await latestEmail.click();

    await this.browser.switchToParentFrame();

    console.log(
      'Latest Yopmail email opened.'
    );
  }

  /* ========================================================= */
  /* Extract OTP From Email Content                            */
  /* ========================================================= */

  async getOtp() {

    const mailContentFrame =
      await this.browser.$(
        'iframe#ifmail'
      );

    await mailContentFrame.waitForExist({
      timeout: 20000
    });

    await this.browser.switchToFrame(
      mailContentFrame
    );

    const emailBody =
      await this.browser.$(
        'body'
      );

    await emailBody.waitForDisplayed({
      timeout: 20000
    });

    /*
     * The email body can become visible before the actual
     * email content and OTP have finished rendering.
     *
     * Therefore, do not read the body only once.
     * Poll the email content until the OTP appears.
     */

    const deadline =
      Date.now() + 30000;

    while (Date.now() < deadline) {

      const emailText =
        await emailBody.getText();

      console.log(
        'Checking Yopmail email content for OTP...'
      );

      const otpMatch =
        emailText.match(
          /\b\d{4,6}\b/
        );

      if (otpMatch) {

        await this.browser.switchToParentFrame();

        console.log(
          `Extracted OTP: ${otpMatch[0]}`
        );

        return otpMatch[0];
      }

      /*
       * Give Yopmail time to finish rendering the email
       * before checking the content again.
       */

      await this.browser.pause(500);
    }

    /*
     * Always return to the parent frame before throwing
     * an error so the browser session is left in a clean state.
     */

    await this.browser.switchToParentFrame();

    throw new Error(
      'OTP was not found in the Yopmail email after waiting 30 seconds.'
    );
  }
}

module.exports = {
  YopmailPage
};