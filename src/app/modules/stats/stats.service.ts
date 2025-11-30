import { TRANSACTION_TYPE } from "./../transaction/transaction.interface";
import { System } from "../system/system.model";

import { Transaction } from "../transaction/transaction.model";
import { IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import mongoose from "mongoose";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const sixtyDaysAgo = new Date(now).setDate(now.getDate() - 60);

// Admin
const getStatsForAdmin = async () => {
  //// user And Agent Overview
  const totalUsersPromise = User.countDocuments({ role: Role.USER });
  const totalAgentsPromise = User.countDocuments({ role: Role.AGENT });
  const newUsersInLastSevenDaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: Role.USER });
  const newUsersInLastThirtyDaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, role: Role.USER });
  const newUsersInLastSixtyDaysPromise = User.countDocuments({ createdAt: { $gte: sixtyDaysAgo }, role: Role.USER });
  const newAgentsInLastSevenDaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: Role.AGENT });
  const newAgentsInLastThirtyDaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, role: Role.AGENT });
  const newAgentsInLastSixtyDaysPromise = User.countDocuments({ createdAt: { $gte: sixtyDaysAgo }, role: Role.AGENT });

  const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE, role: Role.USER });
  const totalInactiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE, role: Role.USER });

  const totalActiveAgentsPromise = User.countDocuments({ isActive: IsActive.ACTIVE, role: Role.AGENT });
  const totalInactiveAgentsPromise = User.countDocuments({ isActive: IsActive.INACTIVE, role: Role.AGENT });

  const [
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
  ] = await Promise.all([
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

  const systemPromise = System.findOne({});
  const averageUserWalletBalancePromise = Wallet.aggregate([
    // stage 1:
    {
      $group: {
        _id: null,
        avg: { $avg: "$balance" },
      },
    },
  ]);

  const [systemDoc, averageUserWalletBalance] = await Promise.all([systemPromise, averageUserWalletBalancePromise]);

  const systemBalance = systemDoc?.balance;
  const agentComimissionPayout = systemDoc?.agentComimissionPayout;
  // console.log(averageUserWalletBalance)
  let totalSystemRevenue = 0;
  if (systemBalance && systemBalance > 50) totalSystemRevenue = systemBalance - 50;
  const systemBalanceAndRevenue = {
    systemBalance,
    averageUserWalletBalance: averageUserWalletBalance[0].avg,
    totalSystemRevenue,
    agentComimissionPayout,
  };

  // // Transaction Overview

  const totalTransactionPromise = Transaction.countDocuments();
  const totalTransactionAmountPromise = Transaction.aggregate([
    {
      //stage 1: group
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);

  const transactionByTypePromise = Transaction.aggregate([
    // stage 1: grouping
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        amount: { $sum: "$amount" },
      },
    },
  ]);
  const transactionBySourcePromise = Transaction.aggregate([
    // stage 1: grouping
    {
      $group: {
        _id: "$source",
        count: { $sum: 1 },
        amount: { $sum: "$amount" },
      },
    },
  ]);
  const [totalTransaction, totalTransactionAmount, transactionByType, transactionBySource] = await Promise.all([
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

  const topAgentsPromise = Transaction.aggregate([
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
  const topUsersPromise = Transaction.aggregate([
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
      $match: { "user.role": Role.USER }, // <-- Role filtering for users
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

  const [topAgents, topUsers] = await Promise.all([topAgentsPromise, topUsersPromise]);

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
};

// User

const getStatsForUser = async (userId: string) => {
  // Wallet Overview

  const walletPromise = Wallet.findOne({ user: userId });
  const totalCashInFromAgentPromise = Transaction.aggregate([
    //$match
    { $match: { receiverId: new mongoose.Types.ObjectId(userId), type: TRANSACTION_TYPE.CASH_IN } },

    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);
  const totalCashOutToAgentPromise = Transaction.aggregate([
    //$match
    { $match: { senderId: new mongoose.Types.ObjectId(userId), type: TRANSACTION_TYPE.CASH_OUT } },

    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);
  const totalAddMOneyPromise = Transaction.aggregate([
    //$match
    { $match: { receiverId: new mongoose.Types.ObjectId(userId), type: TRANSACTION_TYPE.ADD_MONEY } },

    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);

  const [wallet, totalCashInFromAgent, totalCashOutToAgent, totalAddMOney] = await Promise.all([
    walletPromise,
    totalCashInFromAgentPromise,
    totalCashOutToAgentPromise,
    totalAddMOneyPromise,
  ]);

  const walletOverview = {
    currentBalance: wallet?.balance,
    totalCashInFromAgent: totalCashInFromAgent[0].sum,
    totalCashOut: totalCashOutToAgent[0].sum,
    totalAddMOney: totalAddMOney[0].sum,
  };

  ////Transaction Overview
  const userTransactionsSumAndAmountPromise = Transaction.aggregate([
    // stage 1 matching

    {
      $match: {
        $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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
  const transactionByTypePromise = Transaction.aggregate([
    // stage 1 matching

    {
      $match: {
        $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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
  const [userTransactionsSumAndAmount, transactionByType] = await Promise.all([
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

  const monthlyTransactionAmountPromise = Transaction.aggregate([
    // stage 1:match
    {
      $match: {
        $and: [
          {
            $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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

  const [monthlyTransactionAmount] = await Promise.all([monthlyTransactionAmountPromise]);

  // data except months are nothing but TRANSACTION_TYPE
  const monthlyTransactionAmountByTypeInitialPromise = Transaction.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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

  const [monthlyTransactionAmountByTypeInitial] = await Promise.all([monthlyTransactionAmountByTypeInitialPromise]);
  // Shaping the output
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultMap: any = {};
  monthlyTransactionAmountByTypeInitial.forEach((item) => {
    const key = `${item.year}-${item.month}`;

    if (!resultMap[key]) {
      resultMap[key] = {
        month: months[item.month],
        year: item.year,
        [TRANSACTION_TYPE.ADD_MONEY]: 0,
        [TRANSACTION_TYPE.CASH_OUT]: 0,
        [TRANSACTION_TYPE.CASH_IN]: 0,
        [TRANSACTION_TYPE.SEND_MONEY]: 0,
      };
    }

    resultMap[key][item.type] = item.amount;
  });
  const monthlyTransactionAmountByType = Object.values(resultMap);
  const monthlyActivity = { monthlyTransactionAmount, monthlyTransactionAmountByType };

  ////Recent 5 Transactions

  const recentFiveTRansactionsPromise = Transaction.aggregate([
    //stage 1: Match
    {
      $match: {
        $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
      },
    },
    // stage 2
    {
      $sort: { createdAt: -1 },
    },

    //stage 3:limit
    {$limit:5}
  ]);

  const [recentFiveTRansactions] = await Promise.all([recentFiveTRansactionsPromise]);
 

  return { walletOverview, transactionOverview, monthlyActivity,recentFiveTRansactions };
};

//agents


const getStatsForAgent = async (userId: string) => {
  // Wallet Overview

  const walletPromise = Wallet.findOne({ user: userId });
  const totalCashInToUserPromise = Transaction.aggregate([
    //$match
    { $match: { senderId: new mongoose.Types.ObjectId(userId), type: TRANSACTION_TYPE.CASH_IN } },

    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);
  const totalCashOutToAgentPromise = Transaction.aggregate([
    //$match
    { $match: { receiverId: new mongoose.Types.ObjectId(userId), type: TRANSACTION_TYPE.CASH_OUT } },

    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);
  const totalAddMOneyPromise = Transaction.aggregate([
    //$match
    { $match: { receiverId: new mongoose.Types.ObjectId(userId), type: TRANSACTION_TYPE.ADD_MONEY } },

    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" },
      },
    },
  ]);

  const [wallet, totalCashInToUser, totalCashOutToAgent, totalAddMOney] = await Promise.all([
    walletPromise,
    totalCashInToUserPromise,
    totalCashOutToAgentPromise,
    totalAddMOneyPromise,
  ]);

  const walletOverview = {
    currentBalance: wallet?.balance ?? 0,
    totalCashInToUser: totalCashInToUser[0]?.sum ?? 0,
    totalCashOut: totalCashOutToAgent[0]?.sum ?? 0,
    totalAddMOney: totalAddMOney[0]?.sum ?? 0,
  };

  ////Transaction Overview
  const userTransactionsSumAndAmountPromise = Transaction.aggregate([
    // stage 1 matching

    {
      $match: {
        $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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
  const transactionByTypePromise = Transaction.aggregate([
    // stage 1 matching

    {
      $match: {
        $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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
  const [userTransactionsSumAndAmount, transactionByType] = await Promise.all([
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

  const monthlyTransactionAmountPromise = Transaction.aggregate([
    // stage 1:match
    {
      $match: {
        $and: [
          {
            $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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

  const [monthlyTransactionAmount] = await Promise.all([monthlyTransactionAmountPromise]);

  // data except months are nothing but TRANSACTION_TYPE
  const monthlyTransactionAmountByTypeInitialPromise = Transaction.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
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

  const [monthlyTransactionAmountByTypeInitial] = await Promise.all([monthlyTransactionAmountByTypeInitialPromise]);
  // Shaping the output
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultMap: any = {};
  monthlyTransactionAmountByTypeInitial.forEach((item) => {
    const key = `${item.year}-${item.month}`;

    if (!resultMap[key]) {
      resultMap[key] = {
        month: months[item.month],
        year: item.year,
        [TRANSACTION_TYPE.ADD_MONEY]: 0,
        [TRANSACTION_TYPE.CASH_OUT]: 0,
        [TRANSACTION_TYPE.CASH_IN]: 0,
        [TRANSACTION_TYPE.SEND_MONEY]: 0,
      };
    }

    resultMap[key][item.type] = item.amount;
  });
  const monthlyTransactionAmountByType = Object.values(resultMap);
  const monthlyActivity = { monthlyTransactionAmount, monthlyTransactionAmountByType };

  ////Recent 5 Transactions

  const recentFiveTRansactionsPromise = Transaction.aggregate([
    //stage 1: Match
    {
      $match: {
        $or: [{ receiverId: new mongoose.Types.ObjectId(userId) }, { senderId: new mongoose.Types.ObjectId(userId) }],
      },
    },
    // stage 2
    {
      $sort: { createdAt: -1 },
    },

    //stage 3:limit
    {$limit:5}
  ]);

  const [recentFiveTRansactions] = await Promise.all([recentFiveTRansactionsPromise]);
 

  return { walletOverview, transactionOverview, monthlyActivity,recentFiveTRansactions };
};



//users

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const StatsService = { getStatsForAdmin, getStatsForAgent, getStatsForUser };
