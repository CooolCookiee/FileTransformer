const { Router } = require("express");
const { txtToJson, jsonToTxt } = require("../controllers/convert");

const router = Router();

router.post("/txtToJson", txtToJson);
router.post("/jsonToTxt", jsonToTxt);

module.exports = router;
