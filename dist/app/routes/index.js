"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const otp_route_1 = require("../modules/otp/otp.route");
const stats_route_1 = require("../modules/stats/stats.route");
const newsLetter_route_1 = require("../modules/newsLetter/newsLetter.route");
const clientMessage_route_1 = require("../modules/clientMessage/clientMessage.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    { path: "/auth", route: auth_route_1.AuthRoutes },
    { path: "/transaction", route: transaction_route_1.TransactionRoute },
    { path: "/wallet", route: wallet_route_1.WalletRoute },
    { path: "/otp", route: otp_route_1.OtpRoutes },
    { path: "/stats", route: stats_route_1.StatsRoutes },
    { path: "/news-letter", route: newsLetter_route_1.NewsLetterRoute },
    { path: "/client-message", route: clientMessage_route_1.ClientMessageRoute },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
