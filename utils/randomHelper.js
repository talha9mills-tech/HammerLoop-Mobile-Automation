/*************************************************************
 * Utility: Random Helper
 * Purpose: Reusable random selection utilities.
 *************************************************************/

/* ========================================================= */
/* Get One Random Item                                       */
/* ========================================================= */
function getRandomItem(items) {

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error(
            'Cannot select a random item from an empty array.'
        );
    }

    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];
}

/* ========================================================= */
/* Get Multiple Unique Random Items                          */
/* ========================================================= */
function getRandomItems(items, count) {

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error(
            'Cannot select random items from an empty array.'
        );
    }

    if (count > items.length) {
        throw new Error(
            'Requested more random items than available.'
        );
    }

    const shuffled =
        [...items].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
}

module.exports = {
    getRandomItem,
    getRandomItems
};