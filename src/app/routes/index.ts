import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TransactionRoute } from "../modules/transaction/transaction.route";
import { WalletRoute } from "../modules/wallet/wallet.route";
import { OtpRoutes } from "../modules/otp/otp.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  { path: "/auth", route: AuthRoutes },
  { path: "/transaction", route: TransactionRoute },
  { path: "/wallet", route: WalletRoute },
  { path: "/otp", route: OtpRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
