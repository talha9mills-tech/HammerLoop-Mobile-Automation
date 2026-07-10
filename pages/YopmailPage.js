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

    const emailText =
      await emailBody.getText();

    await this.browser.switchToParentFrame();

    const otpMatch =
      emailText.match(
        /\b\d{4,6}\b/
      );

    if (!otpMatch) {

      throw new Error(
        'OTP was not found in the Yopmail email.'
      );
    }

    return otpMatch[0];
  }
}

module.exports = {
  YopmailPage
};