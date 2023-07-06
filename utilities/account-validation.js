const accountModel = require("../models/account-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error(
            "Email exists. Please log in or use a different email"
          );
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      // Check if email exists in the database
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error("This email is not registered. Please sign up.");
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      // .notEmpty()
      .withMessage("Please enter your password."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Account Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const accountId = req.body.account_id;
        const accountData = await accountModel.getAccountById(accountId);
        const currentEmail = accountData.account_email;
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        // check if email exists only if it's not the current email
        if (emailExists && account_email !== currentEmail) { // don't know a better way..
          throw new Error("Email exists. Please use a different email");
        }
      }),
    // valid account_id is required  -- Not sure if I need this
    body("account_id").trim().isInt().withMessage("Invalid account id."),
  ];
};

/* ******************************
 * Check account update data
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      title: "Edit Account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Password Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    body("account_id").trim().isInt().withMessage("Invalid account id."),
  ];
};

/* ******************************
 Check update password
 ***************************** */
validate.checkUpdateAccountPassword = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = res.locals.accountData;
    res.render("account/update-account", {
      title: "Edit Account",
      nav,
      errors,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id,
    });

    return;
  }
  next();
};

module.exports = validate;