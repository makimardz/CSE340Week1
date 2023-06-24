// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get(
    "/detail/:invId",
    utilities.handleErrors(invController.buildVehicleByInvId)
  );

module.exports = router;