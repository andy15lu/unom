const express = require("express");
const parserJson = express.json();
const router =express.Router();
const useHandler = require("../../pkg/useHandler.js");
const {updateItems} = require("./itemController.js");


router.post("/update", parserJson, (req, res) => useHandler(req, res, updateItems) );
module.exports = router;