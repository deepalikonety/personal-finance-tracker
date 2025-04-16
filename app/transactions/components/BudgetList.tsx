type Budget = {
  _id: string;
  category: string;
  amount: number;
  month: string;
};

type BudgetListProps = {
  budgets: Budget[];
  month: string;
  setMonth: (val: string) => void;
  loading: boolean;
};

export default function BudgetList({ budgets, month, setMonth, loading }: BudgetListProps) {
  return (
    <div className="border p-4 rounded-xl shadow-md bg-white max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Budgets for {month}</h2>

      <div>
        <label className="block mb-1 font-medium">Select Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <p>No budgets found for this month.</p>
      ) : (
        <ul className="space-y-2">
          {budgets.map((b) => (
            <li
              key={b._id}
              className="flex justify-between items-center border-b pb-1"
            >
              <span className="font-medium">{b.category}</span>
              <span>₹{b.amount.toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
