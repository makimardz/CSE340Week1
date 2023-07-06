const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id;
  const classification_name = await invModel.getClassificationNameById(classification_id);
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data.length > 0 ? data[0].classification_name : classification_name;
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build inventory item details by inv id view
 * ************************** */
invCont.buildDetailsByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryByInvId(inv_id);
  // console.log(data);
  const invDetailsView = await utilities.buildDetails(data);
  let nav = await utilities.getNav();
  const yearMakeMod =
    data.inv_year + " " + data.inv_make + " " + data.inv_model;
  res.render("./inventory/details", {
    title: yearMakeMod,
    nav,
    invDetailsView,
    errors: null,
  });
};

/* ***************************
 *  Build Vehicle/Inventory Management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ***************************
 *  Build Add New Classification view
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ******************************
 * Process add classification
 * ***************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const classificationResult = await invModel.addClassification(
    classification_name
  );

  if (classificationResult) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash(
      "notice",
      `The "${classification_name}" classification was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the classification was not added.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ******************************
 * Build add new inventory view
 * ***************************** */
invCont.buildNewInventory = async function (req, res, next) {
  let classificationSelect = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ******************************
 * Process add inventory
 * ***************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const inventoryResult = await invModel.addVehicleToInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (inventoryResult) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_model} ${inv_make} was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the vehicle was not added.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData.length === 0) {
    return res.json([]);
  } else if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Process Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);

  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/inv/delete/inv_id");
  }
};

module.exports = invCont;