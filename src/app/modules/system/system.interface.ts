/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISystemCharges {
  type: string;
  charge: number;
  perAmountTransaction?: number | null;
  agentCommission?: number | null;
}

export interface ISystem {
  balance: number;
  systemCharges: ISystemCharges[];
  createdAt?: Date;
}
