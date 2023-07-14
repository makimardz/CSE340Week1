// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// Route to build vehicle management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildVehicleManagement)
);

// Route to build inventory by classification view
router.get(
  "/type/:classification_id",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory item details by inv id view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailsByInvId)
);

// Route to build add new classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildNewClassification)
);
// Post route to add new classification
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add new inventory item view
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildNewInventory)
);
// Post route to add new inventory item
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Get inventory for AJAX route
router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// route to build edit/update inventory by inventory id view
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);
// POST route to update inventory item
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// GET route to delete inventory item - Deliver the delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
);
// POST route to delete inventory item
router.post(
  "/delete/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryItem)
);

// GET route to delete classification - Deliver the delete confirmation view
router.get(
  "/delete-classification/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteClassificationView)
);

// POST route to delete classification
router.post(
  "/delete-classification/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteClassification)
);

module.exports = router;