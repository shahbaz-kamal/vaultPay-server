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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const transaction_interface_1 = require("./../transaction/transaction.interface");
const system_model_1 = require("../system/system.model");
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const sixtyDaysAgo = new Date(now).setDate(now.getDate() - 60);
// Admin
const getStatsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    //// user And Agent Overview
    const totalUsersPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.USER });
    const totalAgentsPromise = user_model_1.User.countDocuments({ role: user_interface_1.Role.AGENT });
    const newUsersInLastSevenDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: user_interface_1.Role.USER });
    const newUsersInLastThirtyDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, role: user_interface_1.Role.USER });
    const newUsersInLastSixtyDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sixtyDaysAgo }, role: user_interface_1.Role.USER });
    const newAgentsInLastSevenDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: user_interface_1.Role.AGENT });
    const newAgentsInLastThirtyDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, role: user_interface_1.Role.AGENT });
    const newAgentsInLastSixtyDaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sixtyDaysAgo }, role: user_interface_1.Role.AGENT });
    const totalActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE, role: user_interface_1.Role.USER });
    const totalInactiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE, role: user_interface_1.Role.USER });
    const totalActiveAgentsPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE, role: user_interface_1.Role.AGENT });
    const totalInactiveAgentsPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE, role: user_interface_1.Role.AGENT });
    const [totalUsers, totalAgents, newUsersInLastSevenDays, newUsersInLastThirtyDays, newUsersInLastSixtyDays, newAgentsInLastSevenDays, newAgentsInLastThirtyDays, newAgentsInLastSixtyDays, totalActiveUsers, totalInactiveUsers, totalActiveAgents, totalInactiveAgents,] = yield Promise.all([
        totalUsersPromise,
        totalAgentsPromise,
        newUsersInLastSevenDaysPromise,
        newUsersInLastThirtyDaysPromise,
        newUsersInLastSixtyDaysPromise,
        newAgentsInLastSevenDaysPromise,
        newAgentsInLastThirtyDaysPromise,
        newAgentsInLastSixtyDaysPromise,
        totalActiveUsersPromise,
        totalInactiveUsersPromise,
        totalActiveAgentsPromise,
        totalInactiveAgentsPromise,
    ]);
    const userAndAgentOverview = {
        totalUsers,
        totalAgents,
        newUsersInLastSevenDays,
        newUsersInLastThirtyDays,
        newUsersInLastSixtyDays,
        newAgentsInLastSevenDays,
        newAgentsInLastThirtyDays,
        newAgentsInLastSixtyDays,
        totalActiveUsers,
        totalInactiveUsers,
        totalActiveAgents,
        totalInactiveAgents,
    };
    //// SystemBalanceAndRevenuew
    const systemPromise = system_model_1.System.findOne({});
    const averageUserWalletBalancePromise = wallet_model_1.Wallet.aggregate([
        // stage 1:
        {
            $group: {
                _id: null,
                avg: { $avg: "$balance" },
            },
        },
    ]);
    const [systemDoc, averageUserWalletBalance] = yield Promise.all([systemPromise, averageUserWalletBalancePromise]);
    const systemBalance = systemDoc === null || systemDoc === void 0 ? void 0 : systemDoc.balance;
    const agentComimissionPayout = systemDoc === null || systemDoc === void 0 ? void 0 : systemDoc.agentComimissionPayout;
    // console.log(averageUserWalletBalance)
    let totalSystemRevenue = 0;
    if (systemBalance && systemBalance > 50)
        totalSystemRevenue = systemBalance - 50;
    const systemBalanceAndRevenue = {
        systemBalance,
        averageUserWalletBalance: averageUserWalletBalance[0].avg,
        totalSystemRevenue,
        agentComimissionPayout,
    };
    // // Transaction Overview
    const totalTransactionPromise = transaction_model_1.Transaction.countDocuments();
    const totalTransactionAmountPromise = transaction_model_1.Transaction.aggregate([
        {
            //stage 1: group
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const transactionByTypePromise = transaction_model_1.Transaction.aggregate([
        // stage 1: grouping
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                amount: { $sum: "$amount" },
            },
        },
    ]);
    const transactionBySourcePromise = transaction_model_1.Transaction.aggregate([
        // stage 1: grouping
        {
            $group: {
                _id: "$source",
                count: { $sum: 1 },
                amount: { $sum: "$amount" },
            },
        },
    ]);
    const [totalTransaction, totalTransactionAmount, transactionByType, transactionBySource] = yield Promise.all([
        totalTransactionPromise,
        totalTransactionAmountPromise,
        transactionByTypePromise,
        transactionBySourcePromise,
    ]);
    const transactionOverview = {
        totalTransaction,
        totalTransactionAmount: totalTransactionAmount[0].sum,
        transactionByType: transactionByType.map((item) => ({
            type: item._id,
            count: item.count,
            amount: item.amount,
        })),
        transactionBySource: transactionBySource.map((item) => ({
            source: item._id,
            count: item.count,
            amount: item.amount,
        })),
    };
    // //top Performer
    const topAgentsPromise = transaction_model_1.Transaction.aggregate([
        {
            $project: {
                receiver: "$receiverId",
                sender: "$senderId",
                amount: 1,
            },
        },
        {
            $project: {
                userId: { $ifNull: ["$sender", "$receiver"] },
                amount: 1,
            },
        },
        {
            $group: {
                _id: "$userId",
                transactionAmount: { $sum: "$amount" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $match: { "user.role": "AGENT" }, // <-- Role filtering for users
        },
        {
            $sort: { transactionAmount: -1 },
        },
        { $limit: 5 },
        {
            $project: {
                _id: 1,
                name: "$user.name",
                profilePicture: "$user.profilePicture",
                transactionAmount: 1,
            },
        },
    ]);
    const topUsersPromise = transaction_model_1.Transaction.aggregate([
        {
            $project: {
                receiver: "$receiverId",
                sender: "$senderId",
                amount: 1,
            },
        },
        {
            $project: {
                userId: { $ifNull: ["$sender", "$receiver"] },
                amount: 1,
            },
        },
        {
            $group: {
                _id: "$userId",
                transactionAmount: { $sum: "$amount" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $match: { "user.role": user_interface_1.Role.USER }, // <-- Role filtering for users
        },
        {
            $sort: { transactionAmount: -1 },
        },
        { $limit: 5 },
        {
            $project: {
                _id: 1,
                name: "$user.name",
                profilePicture: "$user.profilePicture",
                transactionAmount: 1,
            },
        },
    ]);
    const [topAgents, topUsers] = yield Promise.all([topAgentsPromise, topUsersPromise]);
    const topPerformer = {
        topAgents,
        topUsers,
    };
    return {
        userAndAgentOverview,
        systemBalanceAndRevenue,
        transactionOverview,
        topPerformer,
    };
});
// User
const getStatsForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Wallet Overview
    const walletPromise = wallet_model_1.Wallet.findOne({ user: userId });
    const totalCashInFromAgentPromise = transaction_model_1.Transaction.aggregate([
        //$match
        { $match: { receiverId: new mongoose_1.default.Types.ObjectId(userId), type: transaction_interface_1.TRANSACTION_TYPE.CASH_IN } },
        {
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const totalCashOutToAgentPromise = transaction_model_1.Transaction.aggregate([
        //$match
        { $match: { senderId: new mongoose_1.default.Types.ObjectId(userId), type: transaction_interface_1.TRANSACTION_TYPE.CASH_OUT } },
        {
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const totalAddMOneyPromise = transaction_model_1.Transaction.aggregate([
        //$match
        { $match: { receiverId: new mongoose_1.default.Types.ObjectId(userId), type: transaction_interface_1.TRANSACTION_TYPE.ADD_MONEY } },
        {
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const [wallet, totalCashInFromAgent, totalCashOutToAgent, totalAddMOney] = yield Promise.all([
        walletPromise,
        totalCashInFromAgentPromise,
        totalCashOutToAgentPromise,
        totalAddMOneyPromise,
    ]);
    const walletOverview = {
        currentBalance: wallet === null || wallet === void 0 ? void 0 : wallet.balance,
        totalCashInFromAgent: totalCashInFromAgent[0].sum,
        totalCashOut: totalCashOutToAgent[0].sum,
        totalAddMOney: totalAddMOney[0].sum,
    };
    ////Transaction Overview
    const userTransactionsSumAndAmountPromise = transaction_model_1.Transaction.aggregate([
        // stage 1 matching
        {
            $match: {
                $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
            },
        },
        // stage 2: Grouping
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                amount: { $sum: "$amount" },
            },
        },
    ]);
    const transactionByTypePromise = transaction_model_1.Transaction.aggregate([
        // stage 1 matching
        {
            $match: {
                $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
            },
        },
        // stage 2: Grouping
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                amount: { $sum: "$amount" },
            },
        },
        {
            $project: {
                _id: 0,
                type: "$_id",
                count: 1,
                amount: 1,
            },
        },
    ]);
    const [userTransactionsSumAndAmount, transactionByType] = yield Promise.all([
        userTransactionsSumAndAmountPromise,
        transactionByTypePromise,
    ]);
    const totalTransaction = userTransactionsSumAndAmount[0].count;
    const transactionsAmount = userTransactionsSumAndAmount[0].amount;
    const transactionOverview = { totalTransaction, transactionsAmount, transactionByType };
    ////monthly Activity
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthlyTransactionAmountPromise = transaction_model_1.Transaction.aggregate([
        // stage 1:match
        {
            $match: {
                $and: [
                    {
                        $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
                    },
                    { createdAt: { $gte: oneYearAgo, $lte: today } },
                ],
            },
        },
        //stage 2: group by month and year
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                amount: { $sum: "$amount" },
            },
        },
        // stage 3: sort by month ascending
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        // stage 4: Sort by year-month ascending
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        // stage 5: Format output
        {
            $project: {
                _id: 0,
                month: {
                    $let: {
                        vars: {
                            months,
                        },
                        in: { $arrayElemAt: ["$$months", "$_id.month"] },
                    },
                },
                year: "$_id.year",
                amount: 1,
            },
        },
    ]);
    const [monthlyTransactionAmount] = yield Promise.all([monthlyTransactionAmountPromise]);
    // data except months are nothing but TRANSACTION_TYPE
    const monthlyTransactionAmountByTypeInitialPromise = transaction_model_1.Transaction.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
                    },
                    { createdAt: { $gte: oneYearAgo, $lte: today } },
                ],
            },
        },
        // group by YEAR, MONTH, TYPE
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    type: "$type",
                },
                amount: { $sum: "$amount" },
            },
        },
        // reshape into { year, month, type, amount }
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                type: "$_id.type",
                amount: 1,
            },
        },
        // sort chronologically
        {
            $sort: { year: 1, month: 1 },
        },
    ]);
    const [monthlyTransactionAmountByTypeInitial] = yield Promise.all([monthlyTransactionAmountByTypeInitialPromise]);
    // Shaping the output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultMap = {};
    monthlyTransactionAmountByTypeInitial.forEach((item) => {
        const key = `${item.year}-${item.month}`;
        if (!resultMap[key]) {
            resultMap[key] = {
                month: months[item.month],
                year: item.year,
                [transaction_interface_1.TRANSACTION_TYPE.ADD_MONEY]: 0,
                [transaction_interface_1.TRANSACTION_TYPE.CASH_OUT]: 0,
                [transaction_interface_1.TRANSACTION_TYPE.CASH_IN]: 0,
                [transaction_interface_1.TRANSACTION_TYPE.SEND_MONEY]: 0,
            };
        }
        resultMap[key][item.type] = item.amount;
    });
    const monthlyTransactionAmountByType = Object.values(resultMap);
    const monthlyActivity = { monthlyTransactionAmount, monthlyTransactionAmountByType };
    ////Recent 5 Transactions
    const recentFiveTRansactionsPromise = transaction_model_1.Transaction.aggregate([
        //stage 1: Match
        {
            $match: {
                $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
            },
        },
        // stage 2
        {
            $sort: { createdAt: -1 },
        },
        //stage 3:limit
        { $limit: 5 }
    ]);
    const [recentFiveTRansactions] = yield Promise.all([recentFiveTRansactionsPromise]);
    return { walletOverview, transactionOverview, monthlyActivity, recentFiveTRansactions };
});
//agents
const getStatsForAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Wallet Overview
    var _a, _b, _c, _d, _e, _f, _g;
    const walletPromise = wallet_model_1.Wallet.findOne({ user: userId });
    const totalCashInToUserPromise = transaction_model_1.Transaction.aggregate([
        //$match
        { $match: { senderId: new mongoose_1.default.Types.ObjectId(userId), type: transaction_interface_1.TRANSACTION_TYPE.CASH_IN } },
        {
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const totalCashOutToAgentPromise = transaction_model_1.Transaction.aggregate([
        //$match
        { $match: { receiverId: new mongoose_1.default.Types.ObjectId(userId), type: transaction_interface_1.TRANSACTION_TYPE.CASH_OUT } },
        {
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const totalAddMOneyPromise = transaction_model_1.Transaction.aggregate([
        //$match
        { $match: { receiverId: new mongoose_1.default.Types.ObjectId(userId), type: transaction_interface_1.TRANSACTION_TYPE.ADD_MONEY } },
        {
            $group: {
                _id: null,
                sum: { $sum: "$amount" },
            },
        },
    ]);
    const [wallet, totalCashInToUser, totalCashOutToAgent, totalAddMOney] = yield Promise.all([
        walletPromise,
        totalCashInToUserPromise,
        totalCashOutToAgentPromise,
        totalAddMOneyPromise,
    ]);
    const walletOverview = {
        currentBalance: (_a = wallet === null || wallet === void 0 ? void 0 : wallet.balance) !== null && _a !== void 0 ? _a : 0,
        totalCashInToUser: (_c = (_b = totalCashInToUser[0]) === null || _b === void 0 ? void 0 : _b.sum) !== null && _c !== void 0 ? _c : 0,
        totalCashOut: (_e = (_d = totalCashOutToAgent[0]) === null || _d === void 0 ? void 0 : _d.sum) !== null && _e !== void 0 ? _e : 0,
        totalAddMOney: (_g = (_f = totalAddMOney[0]) === null || _f === void 0 ? void 0 : _f.sum) !== null && _g !== void 0 ? _g : 0,
    };
    ////Transaction Overview
    const userTransactionsSumAndAmountPromise = transaction_model_1.Transaction.aggregate([
        // stage 1 matching
        {
            $match: {
                $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
            },
        },
        // stage 2: Grouping
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                amount: { $sum: "$amount" },
            },
        },
    ]);
    const transactionByTypePromise = transaction_model_1.Transaction.aggregate([
        // stage 1 matching
        {
            $match: {
                $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
            },
        },
        // stage 2: Grouping
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                amount: { $sum: "$amount" },
            },
        },
        {
            $project: {
                _id: 0,
                type: "$_id",
                count: 1,
                amount: 1,
            },
        },
    ]);
    const [userTransactionsSumAndAmount, transactionByType] = yield Promise.all([
        userTransactionsSumAndAmountPromise,
        transactionByTypePromise,
    ]);
    const totalTransaction = userTransactionsSumAndAmount[0].count;
    const transactionsAmount = userTransactionsSumAndAmount[0].amount;
    const transactionOverview = { totalTransaction, transactionsAmount, transactionByType };
    ////monthly Activity
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthlyTransactionAmountPromise = transaction_model_1.Transaction.aggregate([
        // stage 1:match
        {
            $match: {
                $and: [
                    {
                        $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
                    },
                    { createdAt: { $gte: oneYearAgo, $lte: today } },
                ],
            },
        },
        //stage 2: group by month and year
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                amount: { $sum: "$amount" },
            },
        },
        // stage 3: sort by month ascending
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        // stage 4: Sort by year-month ascending
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        // stage 5: Format output
        {
            $project: {
                _id: 0,
                month: {
                    $let: {
                        vars: {
                            months,
                        },
                        in: { $arrayElemAt: ["$$months", "$_id.month"] },
                    },
                },
                year: "$_id.year",
                amount: 1,
            },
        },
    ]);
    const [monthlyTransactionAmount] = yield Promise.all([monthlyTransactionAmountPromise]);
    // data except months are nothing but TRANSACTION_TYPE
    const monthlyTransactionAmountByTypeInitialPromise = transaction_model_1.Transaction.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
                    },
                    { createdAt: { $gte: oneYearAgo, $lte: today } },
                ],
            },
        },
        // group by YEAR, MONTH, TYPE
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    type: "$type",
                },
                amount: { $sum: "$amount" },
            },
        },
        // reshape into { year, month, type, amount }
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                type: "$_id.type",
                amount: 1,
            },
        },
        // sort chronologically
        {
            $sort: { year: 1, month: 1 },
        },
    ]);
    const [monthlyTransactionAmountByTypeInitial] = yield Promise.all([monthlyTransactionAmountByTypeInitialPromise]);
    // Shaping the output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultMap = {};
    monthlyTransactionAmountByTypeInitial.forEach((item) => {
        const key = `${item.year}-${item.month}`;
        if (!resultMap[key]) {
            resultMap[key] = {
                month: months[item.month],
                year: item.year,
                [transaction_interface_1.TRANSACTION_TYPE.ADD_MONEY]: 0,
                [transaction_interface_1.TRANSACTION_TYPE.CASH_OUT]: 0,
                [transaction_interface_1.TRANSACTION_TYPE.CASH_IN]: 0,
                [transaction_interface_1.TRANSACTION_TYPE.SEND_MONEY]: 0,
            };
        }
        resultMap[key][item.type] = item.amount;
    });
    const monthlyTransactionAmountByType = Object.values(resultMap);
    const monthlyActivity = { monthlyTransactionAmount, monthlyTransactionAmountByType };
    ////Recent 5 Transactions
    const recentFiveTRansactionsPromise = transaction_model_1.Transaction.aggregate([
        //stage 1: Match
        {
            $match: {
                $or: [{ receiverId: new mongoose_1.default.Types.ObjectId(userId) }, { senderId: new mongoose_1.default.Types.ObjectId(userId) }],
            },
        },
        // stage 2
        {
            $sort: { createdAt: -1 },
        },
        //stage 3:limit
        { $limit: 5 }
    ]);
    const [recentFiveTRansactions] = yield Promise.all([recentFiveTRansactionsPromise]);
    return { walletOverview, transactionOverview, monthlyActivity, recentFiveTRansactions };
});
//users
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.StatsService = { getStatsForAdmin, getStatsForAgent, getStatsForUser };
