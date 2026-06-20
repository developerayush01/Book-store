import axiosInstance from "./axios";

export const initializeEsewaPayment = async (
  bookIds,
  totalPrice,
  addressId,
) => {
  const { data } = await axiosInstance.post(
    "/api/payment/initialize-esewa",
    { book_ids: bookIds, amount: totalPrice, address_id: addressId },
    { withCredentials: true },
  );

  const { payment, transaction, esewaUrl, productCode } = data;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = esewaUrl;

  const fields = {
    amount: transaction.amount,
    tax_amount: 0,
    total_amount: transaction.amount,
    transaction_uuid: transaction.transaction_uuid,
    product_code: productCode,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `https://clean-coins-film.loca.lt/api/payment/esewa/success`,
    failure_url: `https://clean-coins-film.loca.lt/api/payment/esewa/failure`,
    signed_field_names: payment.signed_field_names,
    signature: payment.signature,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  console.log("success_url:", fields.success_url);
  console.log("failure_url:", fields.failure_url);
  document.body.appendChild(form);
  form.submit();
};
