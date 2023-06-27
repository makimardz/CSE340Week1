const express = require('express');
const router = express.Router();

// Index Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));
router.use("/favicon.ico", express.static(__dirname + "public/images/favicon.ico"));
router.get("/favicon.ico", (req, res) => res.status(204));

module.exports = router;



