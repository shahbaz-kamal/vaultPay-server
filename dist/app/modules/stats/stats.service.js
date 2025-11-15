"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const fifteenDaysAgo = new Date(now).setDate(now.getDate() - 15);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const sixtyDaysAgo = new Date(now).setDate(now.getDate() - 60);
const getUserStatsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.USER });
    const totalActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE, role: user_interface_1.Role.USER });
    const totalInactiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE, role: user_interface_1.Role.USER });
    const newUsersInLastSevenDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: user_interface_1.Role.USER });
    const totalAgentsPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.AGENT });
    const totalActiveAgentsPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE, role: user_interface_1.Role.AGENT });
    const totalInactiveAgentsPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE, role: user_interface_1.Role.AGENT });
    const newAgentsInLastSevenDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: user_interface_1.Role.AGENT });
    const [totalUsers, totalActiveUsers, totalInactiveUsers, newUsersInLastSevenDays, totalAgents, totalActiveAgents, totalInactiveAgents, newAgentsInLastSevenDays,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInactiveUsersPromise,
        newUsersInLastSevenDaysPromise,
        totalAgentsPromise,
        totalActiveAgentsPromise,
        totalInactiveAgentsPromise,
        newAgentsInLastSevenDaysPromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInactiveUsers,
        newUsersInLastSevenDays,
        totalAgents,
        totalActiveAgents,
        totalInactiveAgents,
        newAgentsInLastSevenDays,
    };
});
const getTransactionStatsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Total transactions
    const totalTransactionsPromise = transaction_model_1.Transaction.countDocuments();
    // 2. Transactions by type
    const transactionsByTypePromise = transaction_model_1.Transaction.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
    ]);
    // 3. Transactions by status
    const transactionsByStatusPromise = transaction_model_1.Transaction.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
    ]);
    // 4. Transactions by source
    const transactionsBySourcePromise = transaction_model_1.Transaction.aggregate([
        { $group: { _id: "$source", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
    ]);
    //   5. Average payment amount
    const avgTransactionAmountPromise = transaction_model_1.Transaction.aggregate([
        //stage 1: Group
        {
            $group: {
                _id: null,
                avgTransactionAmount: { $avg: "$amount" }
            }
        }
    ]);
    // 6. Transactions in last 7, 15, 30, 60 days
    const recentTransactionsPromise = transaction_model_1.Transaction.aggregate([
        {
            $facet: {
                last7Days: [
                    { $match: { createdAt: { $gte: sevenDaysAgo } } },
                    { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
                ],
                last15Days: [
                    { $match: { createdAt: { $gte: fifteenDaysAgo } } },
                    { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
                ],
                last30Days: [
                    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                    { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
                ],
                last60Days: [
                    { $match: { createdAt: { $gte: sixtyDaysAgo } } },
                    { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
                ],
            },
        },
    ]);
    const [totalTransactions, transactionsByType, transactionsByStatus, transactionsBySource, avgTransactionAmount, recentTransactions] = yield Promise.all([
        totalTransactionsPromise,
        transactionsByTypePromise,
        transactionsByStatusPromise,
        transactionsBySourcePromise,
        avgTransactionAmountPromise,
        recentTransactionsPromise,
    ]);
    return {
        totalTransactions, // number
        transactionsByType: transactionsByType.map((t) => ({
            type: t._id,
            count: t.count,
            totalAmount: t.totalAmount,
        })), // { type: string; count: number; totalAmount: number }[]
        transactionsByStatus: transactionsByStatus.map((t) => ({
            status: t._id,
            count: t.count,
            totalAmount: t.totalAmount,
        })), // { status: string; count: number; totalAmount: number }[]
        transactionsBySource: transactionsBySource.map((t) => ({
            source: t._id,
            count: t.count,
            totalAmount: t.totalAmount,
        })), // { source: string; count: number; totalAmount: number }[]
        avgTransactionAmount,
        recentTransactions: {
            last7Days: recentTransactions[0].last7Days[0] || { count: 0, totalAmount: 0 },
            last15Days: recentTransactions[0].last15Days[0] || { count: 0, totalAmount: 0 },
            last30Days: recentTransactions[0].last30Days[0] || { count: 0, totalAmount: 0 },
            last60Days: recentTransactions[0].last60Days[0] || { count: 0, totalAmount: 0 },
        }, // { last7Days: {count:number,totalAmount:number}, ... }
    };
});
//agents
//users
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTransactionStatsForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
exports.StatsService = { getUserStatsForAdmin, getTransactionStatsForAdmin, getTransactionStatsForUser };
