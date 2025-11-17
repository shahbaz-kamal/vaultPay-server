import { Transaction } from "../transaction/transaction.model";
import { IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";

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

//// TransactionOverview

  return {
    userAndAgentOverview,
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
