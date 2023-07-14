// Needed Resources
const accountValidate = require("../utilities/account-validation");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Default route - Management View
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login request
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build login view
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);

// Process Registration Data
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// GET route to build update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);
// POST route to update account
router.post(
  "/updateAccount",
  utilities.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);
// POST route to update password
router.post(
  "/updatePassword",
  utilities.checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdateAccountPassword,
  utilities.handleErrors(accountController.updatePassword)
);

// GET route to logout
router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout)
);

// GET route to delete account
router.get(
  "/delete/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildDeleteAccount)
);

// Post route to delete account
router.post(
  "/deleteAccount",
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteAccount)
);

module.exports = router;