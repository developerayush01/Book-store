const express = require("express");
const auth=require("../middlewares/authMiddleware");

const router = express.Router();
const {
  initializeEsewa,
  esewaSuccess,
  esewaFailure,
} = require("../controllers/paymentController");

router.post("/initialize-esewa",auth, initializeEsewa);
router.get("/esewa/success", esewaSuccess);
router.get("/esewa/failure", esewaFailure);

module.exports = router;