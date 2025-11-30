import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TransactionRoute } from "../modules/transaction/transaction.route";
import { WalletRoute } from "../modules/wallet/wallet.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { StatsRoutes } from "../modules/stats/stats.route";

import { NewsLetterRoute } from "../modules/newsLetter/newsLetter.route";
import { ClientMessageRoute } from "../modules/clientMessage/clientMessage.route";

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
  { path: "/stats", route: StatsRoutes },
  { path: "/news-letter", route: NewsLetterRoute },
  { path: "/client-message", route: ClientMessageRoute },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
