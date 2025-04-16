// app/types/transactions.ts

export type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description?: string;
  category?: {
    name: string;
  };
};
