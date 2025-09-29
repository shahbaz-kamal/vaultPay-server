
/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { ISSLCommerze } from "./sslCommerze.interface";
import axios from "axios";

const sslAddMoneyInit = async(payload: ISSLCommerze) => {
  try {
    const data = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`, //yoursite.com/success.php,
      fail_url: `${envVars.SSL.FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`, //yoursite.com/fail.php,
      cancel_url: `${envVars.SSL.CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`, //yoursite.com/cancel.php,
      shipping_method: "N/A",
      product_name: "Appoinment",
      product_catgory: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01799839985",
      ship_name: payload.name,
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
      // multi_card_name: "N/A",
      // value_a: "N/A",
      // value_b: "N/A",
      // value_c: "N/A",
      // value_d: "N/A",
    };


    const response = await axios({
        method: "POST",
        url: envVars.SSL.ADDMONEY_API,
        data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, error.message);
  }
};

export const SSLService={sslAddMoneyInit}
