import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TransactionRoute } from "../modules/transaction/transaction.route";
import { WalletRoute } from "../modules/wallet/wallet.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  { path: "/auth", route: AuthRoutes },
  { path: "/transaction", route: TransactionRoute },
  { path: "/wallet", route: WalletRoute },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
