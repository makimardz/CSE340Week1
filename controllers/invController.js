const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by inv ID view
 * ************************** */
invCont.buildVehicleByInvId = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getVehicleByInvId(invId);
  const invDetailsView = await utilities.buildDetails(data[0]);
  let nav = await utilities.getNav();
  const yearMakeMod =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/details", {
    title: yearMakeMod,
    nav,
    invDetailsView,
    errors: null,
  });
};

module.exports = invCont;