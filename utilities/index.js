const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="nav-links">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<hr>";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetails = async function (data) {
  let invDetailsView;
  if (data) {
    invDetailsView = `
  <div id="details-container">
    <div id="details-image">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${
      data.inv_model
    }">
    </div>
    <div id="details-info">
      <h2>${data.inv_make} ${data.inv_model} Details</h2>
      <p><span class="descriptionBold">Price:</span> $${new Intl.NumberFormat(
        "en-US"
      ).format(data.inv_price)}</p>
      <p><span class="descriptionBold">Description:</span> ${
        data.inv_description
      }</p>
      <p><span class="descriptionBold">Color:</span> ${data.inv_color}</p>
      <p><span class="descriptionBold">Miles:</span> ${new Intl.NumberFormat().format(
        data.inv_miles
      )}</p>
    </div>
  </div>
  `;
  } else {
    invDetailsView +=
      '<p class="notice">Sorry, no matching vehicles could be found for this classification.</p>';
  }

  return invDetailsView;
};

/* **************************************
 * Build the classification options for the add inventory form
 * ************************************ */
Util.buildClassificationList = async function (option) {
  let data = await invModel.getClassifications();
  let options = "<option value=''>Select a Classification</option>";
  data.rows.forEach((row) => {
    options += `
    <option 
    value="${row.classification_id}"
    ${row.classification_id === Number(option) ? "selected" : ""}>
    ${row.classification_name}</option>`;
  });
  return options;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};



/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountData = res.locals.accountData;
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Check account type for administrative views
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData;
  if (
    accountData.account_type === "Admin" ||
    accountData.account_type === "Employee"
  ) {
    next();
  } else {
    req.flash("notice", "You do not have permission to view that page.");
    req.flash("notice", "Please log in as an Admin or Employee.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Check account type for account management view
 **************************************** */
Util.accountManagementAccountType = async function (data) {
  let invManageLink;
  if (data.account_type === "Admin" || data.account_type === "Employee") {
    invManageLink = `
      <h3>Inventory Management</h3>
      <p><a href="/inv/">Manage Inventory</a></p>`;
  }
  return invManageLink;
};

module.exports = Util;