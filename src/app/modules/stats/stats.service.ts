import { System } from "../system/system.model";
import { Transaction } from "../transaction/transaction.model";
import { IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const fifteenDaysAgo = new Date(now).setDate(now.getDate() - 15);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const sixtyDaysAgo = new Date(now).setDate(now.getDate() - 60);

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

const getTransactionStatsForAdmin = async () => {
  // 1. Total transactions
  const totalTransactionsPromise = Transaction.countDocuments();

  // 2. Transactions by type
  const transactionsByTypePromise = Transaction.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
  ]);

  // 3. Transactions by status
  const transactionsByStatusPromise = Transaction.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
  ]);

  // 4. Transactions by source
  const transactionsBySourcePromise = Transaction.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
  ]);

  //   5. Average payment amount

  const avgTransactionAmountPromise = Transaction.aggregate([
    //stage 1: Group
    {
      $group: {
        _id: null,
        avgTransactionAmount: { $avg: "$amount" },
      },
    },
  ]);

  // 6. Transactions in last 7, 15, 30, 60 days
  const recentTransactionsPromise = Transaction.aggregate([
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

  const [totalTransactions, transactionsByType, transactionsByStatus, transactionsBySource, avgTransactionAmount, recentTransactions] =
    await Promise.all([
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
      type: t._id as string,
      count: t.count as number,
      totalAmount: t.totalAmount as number,
    })), // { type: string; count: number; totalAmount: number }[]
    transactionsByStatus: transactionsByStatus.map((t) => ({
      status: t._id as string,
      count: t.count as number,
      totalAmount: t.totalAmount as number,
    })), // { status: string; count: number; totalAmount: number }[]
    transactionsBySource: transactionsBySource.map((t) => ({
      source: t._id as string,
      count: t.count as number,
      totalAmount: t.totalAmount as number,
    })), // { source: string; count: number; totalAmount: number }[]
    avgTransactionAmount,
    recentTransactions: {
      last7Days: recentTransactions[0].last7Days[0] || { count: 0, totalAmount: 0 },
      last15Days: recentTransactions[0].last15Days[0] || { count: 0, totalAmount: 0 },
      last30Days: recentTransactions[0].last30Days[0] || { count: 0, totalAmount: 0 },
      last60Days: recentTransactions[0].last60Days[0] || { count: 0, totalAmount: 0 },
    }, // { last7Days: {count:number,totalAmount:number}, ... }
  };
};

//agents

//users

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTransactionStatsForUser = async (userId: string) => {
  return {};
};

export const StatsService = { getStatsForAdmin, getTransactionStatsForAdmin, getTransactionStatsForUser };
