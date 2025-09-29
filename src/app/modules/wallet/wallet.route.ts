import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";

const router = express.Router();

router.get("/wallets", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), WalletController.getAllWallet);

export const WalletRoute=router
