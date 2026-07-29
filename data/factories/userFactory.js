/*************************************************************
 * Factory: User Factory
 * Purpose: Generate unique HammerLoop test users.
 *************************************************************/

const {
    names
} = require('../fixtures/names');

const {
    companyNames
} = require('../fixtures/companyNames');

function createUser(role) {

    const fullName =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];

    const companyName =
        companyNames[
            Math.floor(
                Math.random() * companyNames.length
            )
        ];

    const timestamp =
        Date.now();

    const emailPrefix =
        fullName
            .toLowerCase()
            .replace(/\s+/g, '.');

    return {

        role,

        fullName,

        companyName:
            role === 'Employer'
                ? companyName
                : null,

        email:
            `${emailPrefix}.${timestamp}@yopmail.com`,

        phone:
            '5128878584',

        password:
            'Abcd@1234'
    };
}

module.exports = {
    createUser
};