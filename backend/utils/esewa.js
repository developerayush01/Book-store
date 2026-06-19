const crypto = require("crypto");
const axios = require("axios");

function getEsewaPaymentHash({ amount, transaction_uuid }) {
  const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

  const hash = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
    .update(data)
    .digest("base64");

  return {
    signature: hash,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };
}

async function verifyEsewaPayment(encodedData) {
  // 1. Decode base64 string eSewa sends back
  const decodedData = JSON.parse(Buffer.from(encodedData, "base64").toString());

  // 2. Recompute signature to check for tampering
  const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

  const hash = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
    .update(data)
    .digest("base64");

  if (hash !== decodedData.signature) {
    throw new Error("Signature mismatch — possible tampering detected");
  }

  // 3. Hit eSewa status API to independently confirm
  const response = await axios.get(
    `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/`,
    {
      params: {
        product_code: process.env.ESEWA_PRODUCT_CODE,
        total_amount: decodedData.total_amount,
        transaction_uuid: decodedData.transaction_uuid,
      },
    }
  );

  if (
    response.data.status !== "COMPLETE" ||
    response.data.transaction_uuid !== decodedData.transaction_uuid ||
    Number(response.data.total_amount) !== Number(decodedData.total_amount)
  ) {
    throw new Error("Payment verification failed");
  }

  return { response: response.data, decodedData };
}

module.exports = { getEsewaPaymentHash, verifyEsewaPayment };