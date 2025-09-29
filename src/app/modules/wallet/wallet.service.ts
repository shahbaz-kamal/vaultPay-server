import { QueryBuilder } from "../../utils/QueryBuilder";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const getAllWallet = async (query: Record<string, string>) => {
  const modelQuery = new QueryBuilder<IWallet>(
    Wallet.find().populate("user", "name email role isActive"),
    query
  );
  const wallets = modelQuery.filter().sort().fields().pagination();

  const [data, meta] = await Promise.all([wallets.build(), wallets.getMeta()]);

  return { data, meta };
};

export const WalletServices = { getAllWallet };
