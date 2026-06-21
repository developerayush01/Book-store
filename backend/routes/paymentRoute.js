const express = require("express");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();
const {
  initializeEsewa,
  esewaSuccess,
  esewaFailure,
} = require("../controllers/paymentController");

router.post("/initialize-esewa", auth, initializeEsewa);
router.get("/success", esewaSuccess);
router.get("/failure", esewaFailure);

module.exports = router;
