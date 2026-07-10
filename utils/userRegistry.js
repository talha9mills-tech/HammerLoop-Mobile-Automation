/*************************************************************
 * Utility: User Registry
 * Purpose: Save successfully created users to createdUsers.json.
 *************************************************************/

const fs = require('fs');
const path = require('path');

/* ========================================================= */
/* Created Users File Path                                    */
/* ========================================================= */
const filePath =
  path.join(
    __dirname,
    '../data/createdUsers.json'
  );

/* ========================================================= */
/* Save Created User                                          */
/* ========================================================= */
function saveUser(user) {

  /* ======================================================= */
  /* Create Registry File If It Does Not Exist                */
  /* ======================================================= */
  if (
    !fs.existsSync(
      filePath
    )
  ) {

    fs.writeFileSync(
      filePath,
      '[]'
    );
  }

  /* ======================================================= */
  /* Read Existing Users                                      */
  /* ======================================================= */
  let users = [];

  try {

    const fileContent =
      fs.readFileSync(
        filePath,
        'utf8'
      );

    users =
      fileContent.trim()
        ? JSON.parse(
          fileContent
        )
        : [];

  } catch (error) {

    throw new Error(
      `Unable to read createdUsers.json: ${error.message}`
    );
  }

  /* ======================================================= */
  /* Prepare User Record                                      */
  /* ======================================================= */
  const now =
    new Date();

  const userRecord = {

    role:
      user.role,

    fullName:
      user.fullName,

    email:
      user.email,

    phone:
      user.phone,

    password:
      user.password,

    environment:
      user.environment,

    createdDate:
      now
        .toISOString()
        .split('T')[0],

    createdTime:
      now
        .toTimeString()
        .split(' ')[0]
  };

  /* ======================================================= */
  /* Save User Record                                         */
  /* ======================================================= */
  users.push(
    userRecord
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      users,
      null,
      2
    )
  );

  console.log(
    `User saved successfully: ${user.email}`
  );
}

module.exports = {
  saveUser
};