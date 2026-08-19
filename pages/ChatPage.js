/*************************************************************
 * Page Object: Chat Page
 * Purpose: Handle chat navigation, message sending,
 *          and message validation.
 *************************************************************/

class ChatPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Chat Button                                                 */
        /* ========================================================= */

        this.chatButton =
            driver.$(
                '~Chat'
            );

        /* ========================================================= */
        /* Message Input Field                                         */
        /* ========================================================= */

        this.messageInputField =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* Message Send Button                                         */
        /* ========================================================= */

        this.messageSendButton =
            driver.$(
                '//android.widget.FrameLayout[@resource-id="android:id/content"]' +
                '/android.widget.FrameLayout' +
                '/android.view.View' +
                '/android.view.View' +
                '/android.view.View' +
                '/android.view.View' +
                '/android.view.View' +
                '/android.view.View[4]'
            );
    }


    /* ========================================================= */
    /* Open Chat                                                   */
    /* ========================================================= */

    async openChat() {

        await this.chatButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.chatButton.click();

        console.log(
            'Chat screen opened.'
        );
    }


    /* ========================================================= */
    /* Get Conversation                                           */
    /* ========================================================= */

    getConversation(conversationName) {

        return this.driver.$(
            `android=new UiSelector().descriptionContains("${conversationName}")`
        );
    }


    /* ========================================================= */
    /* Open Conversation                                          */
    /* ========================================================= */

    async openConversation(conversationName) {

        const conversation =
            this.getConversation(
                conversationName
            );

        await conversation
            .waitForDisplayed({
                timeout: 15000
            });

        await conversation.click();

        console.log(
            `${conversationName} conversation opened.`
        );
    }


    /* ========================================================= */
    /* Enter Message                                              */
    /* ========================================================= */

    async enterMessage(message) {

        await this.messageInputField
            .waitForDisplayed({
                timeout: 15000
            });

        await this.messageInputField.click();

        await this.messageInputField.clearValue();

        await this.messageInputField.setValue(
            message
        );

        console.log(
            `Message entered: ${message}`
        );
    }


    /* ========================================================= */
    /* Tap Send                                                   */
    /* ========================================================= */

    async tapSend() {

        await this.messageSendButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.messageSendButton.click();

        console.log(
            'Message send button clicked.'
        );
    }


    /* ========================================================= */
    /* Send Message                                               */
    /* ========================================================= */

    async sendMessage(message) {

        await this.enterMessage(
            message
        );

        await this.tapSend();

        console.log(
            `Message sent: ${message}`
        );
    }


    /* ========================================================= */
    /* Get Message                                               */
    /* ========================================================= */

    getMessage(message) {

        return this.driver.$(
            `android=new UiSelector().descriptionContains("${message}")`
        );
    }


    /* ========================================================= */
    /* Verify Message                                            */
    /* ========================================================= */

    async verifyMessage(message) {

        const messageElement =
            this.getMessage(
                message
            );

        await messageElement
            .waitForDisplayed({
                timeout: 30000
            });

        console.log(
            `Message verified successfully: ${message}`
        );
    }
}


module.exports = {
    ChatPage
};