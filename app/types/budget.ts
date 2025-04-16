// types/budget.ts

export interface Budget {
  amount: number;
  month: string; // like "2025-04"
  category: string | { label?: string; name?: string };
}
