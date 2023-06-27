const express = require("express");
const router = new express.Router();

// error route
router.get("/error", (req, res, next) => {
  // This one displays 500 as title
  //   next({ status: 500, message: "Test server error message." });

  // This one displays Server Error as title
  next({ message: "Test server error message." });
});

module.exports = router;