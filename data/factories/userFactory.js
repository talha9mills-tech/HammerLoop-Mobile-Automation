const {
    randomUUID
} = require('crypto');

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

    // ========================================
    // Generate Unique Company Name
    // ========================================

    const uniqueCompanyName =
        role === 'Employer'
            ? `${companyName} ${randomUUID().slice(0, 8)}`
            : null;

    return {

        role,

        fullName,

        companyName:
            uniqueCompanyName,

        email:
            `${emailPrefix}.${timestamp}@yopmail.com`,

        phone: 
            process.env.DEFAULT_PHONE, 
        
        password: 
            process.env.DEFAULT_PASSWORD
    };
}

module.exports = {
    createUser
};