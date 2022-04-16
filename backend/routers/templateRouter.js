const express = require("express");
const parserJson = express.json();
let router =  express.Router();
const {createTemplate, getTemplate, getTemplates} = require("../controllers/templateUnitController.js");

router.post("/add", parserJson, createTemplate );
router.use("/:id", getTemplate );
router.use("/",     getTemplates );

module.exports = router;