import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { sendMoneyZodSchema } from "./transaction.validation";

const router = express.Router();

router.post(
  "/add-money",
  checkAuth(...Object.values(Role)),
  TransactionController.addMoney
);
router.post(
  "/add-money/success",

  TransactionController.addMoneySuccess
);
router.post(
  "/add-money/fail",

  TransactionController.addMoneyFail
);
router.post(
  "/add-money/cancel",

  TransactionController.addMoneyCancel
);
router.post(
  "/send-money",
  validateRequest(sendMoneyZodSchema),
  checkAuth(...Object.values(Role)),
  TransactionController.sendMoney
);
router.post(
  "/cash-out",
  validateRequest(sendMoneyZodSchema),
  checkAuth(...Object.values(Role)),
  TransactionController.cashOut
);
router.post(
  "/cash-in",
  validateRequest(sendMoneyZodSchema),
  checkAuth(...Object.values(Role)),
  TransactionController.cashIn
);

export const TransactionRoute = router;
