import { format } from "date-fns";
import { LucideCircleDollarSign, Pencil, Trash2 } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { accounts } from "~/pages/Expenses";
import type { ExpenseType } from "~/types";

const ExpenseCard = ({
  expense,
  currency,
  handleDelete,
  setEditingExpense,
}: {
  expense: ExpenseType;
  currency: string;
  setEditingExpense: (expense: ExpenseType) => void;
  handleDelete: (expenseId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const account = createMemo(() =>
    accounts()?.find((acc) => acc.id === expense.accountId),
  );

  return (
    <div class="bg-orange-100 text-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-red-400">
      {/* Expense Header */}
      <div
        class="flex items-start justify-between mb-3"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div class="flex items-center gap-3 w-full">
          <div class="p-2 bg-red-200 rounded-lg text-orange-600">
            <LucideCircleDollarSign />
          </div>
          <div>
            <h3 class="font-semibold text-lg">
              {currency}
              {expense.amount}
            </h3>
            <p class="text-sm text-gray-500 capitalize">
              {format(expense.date!, "PP")}
            </p>
          </div>
          <div class="flex-1 flex flex-col items-end justify-center">
            <span>Account:</span>
            <p class="text-sm text-gray-500 capitalize">{account()?.name}</p>
          </div>
        </div>
      </div>
      <Show when={isExpanded()}>
        {/* Expense Details */}
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Account Type:</span>
            <span class="font-medium capitalize">
              {account()?.type.replace("_", " ")}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Category:</span>
            <span class="font-medium">{expense.category}</span>
          </div>
          <div class="flex flex-col gap-1 text-sm">
            <span class="text-gray-600">Description:</span>
            <span class="font-medium">{expense.description}</span>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-2">
          <button
            onClick={() => setEditingExpense(expense)}
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
          >
            <Pencil size={16} style={{ transform: "translateY(1px)" }} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(expense.id)}
            class="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm"
          >
            <Trash2 size={16} style={{ transform: "translateY(1px)" }} />
            Delete
          </button>
        </div>
      </Show>
    </div>
  );
};

export default ExpenseCard;
