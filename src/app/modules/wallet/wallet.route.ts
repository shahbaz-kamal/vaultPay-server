import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";

const router = express.Router();

router.get(
  "/wallets",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WalletController.getAllWallet
);
router.patch(
  "/:id",
  //   validateRequest(updateUserZodSchema),
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  WalletController.updateWallet
);

export const WalletRoute = router;
