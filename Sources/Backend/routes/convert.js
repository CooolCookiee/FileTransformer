const { Router } = require("express");
const { txtToJson, jsonToTxt } = require("../controllers/convert");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.post(
  "/txtToJson",
  [
    check("secret", "secret is required").not().isEmpty(),
    check("txtcontent", "txtcontent is required").not().isEmpty(),
    check("delimiter", "delimiter is required").not().isEmpty(),
    validateFields,
  ],
  txtToJson
);

router.post(
  "/jsonToTxt",
  [
    check("secret", "secret is required").not().isEmpty(),
    check("parsedData", "parsedData is required").not().isEmpty(),
    check("delimiter", "delimiter is required").not().isEmpty(),
    validateFields,
  ],
  jsonToTxt
);

module.exports = router;
