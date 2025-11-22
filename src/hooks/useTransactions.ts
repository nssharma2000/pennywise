import { createMemo, createResource, createSignal } from "solid-js";
import type { ExpenseType, IncomeType } from "~/types";
import { useExpenses } from "./useExpenses";
import { useIncomes } from "./useIncomes";

export type TransactionKind = "income" | "expense";
export type TransactionEntity = ExpenseType | IncomeType;

export type TransactionType = TransactionEntity & {
  transactionKind: TransactionKind;
};
// TODO: Labels
export const TRANSACTION_TABS: {
  label: string;
  value: TransactionKind | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Expenses", value: "expense" },
  { label: "Incomes", value: "income" },
];

export const useTransactions = () => {
  const {
    expenses,
    loading: expensesLoading,
    refresh: expensesRefresh,
    filter: expenseFilter,
    filterByDateRange: expenseFilterByDateRange,
    filters: expenseFilters,
    create: createExpense,
    update: updateExpense,
    delete: deleteExpense,
  } = useExpenses();
  const {
    incomes,
    loading: incomesLoading,
    refresh: incomesRefresh,
    filter: incomeFilter,
    filterByDateRange: incomeFilterByDateRange,
    filters: incomeFilters,
    create: createIncome,
    update: updateIncome,
    delete: deleteIncome,
  } = useIncomes();

  const [currentTab, setCurrentTab] = createSignal<
    (typeof TRANSACTION_TABS)[number]["value"]
  >(TRANSACTION_TABS[0].value);

  // Normalize: tag each with transactionKind
  const transactionExpenses = createMemo(() =>
    (expenses() || []).map((e) => ({
      ...e,
      transactionKind: "expense" as const,
    }))
  );
  const transactionIncomes = createMemo(() =>
    (incomes() || []).map((e) => ({
      ...e,
      transactionKind: "income" as const,
    }))
  );

  const fetchTransactions = async () => {
    // Merge & sort by date (latest first)
    const combined = [...transactionExpenses(), ...transactionIncomes()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return combined;
  };

  const [transactions, { refetch }] = createResource(
    () => [expenses(), incomes()],
    fetchTransactions
  );

  const filter = (cat?: string, acc?: string) => {
    incomeFilter(cat, acc);
    expenseFilter(cat, acc);
  };
  const filterByDateRange = (start: string, end: string) => {
    expenseFilterByDateRange(start, end);
    incomeFilterByDateRange(start, end);
  };

  const refresh = () => {
    refetch();
    expensesRefresh();
    incomesRefresh();
  };
  const changeTab = (v: (typeof TRANSACTION_TABS)[number]["value"]) => {
    setCurrentTab(v);
  };

  const create = async (
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => {
    if (type === "expense") await createExpense(data as ExpenseType);
    if (type === "income") await createIncome(data as IncomeType);
  };
  const update = async (
    id: string,
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => {
    if (type === "expense") await updateExpense(id, data as ExpenseType);
    if (type === "income") await updateIncome(id, data as IncomeType);
  };
  const deleteTransaction = async (id: string, type: TransactionKind) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      if (type === "expense") await deleteExpense(id);
      if (type === "income") await deleteIncome(id);
    }
  };

  return {
    transactions: () =>
      currentTab() === "expense"
        ? transactionExpenses()
        : currentTab() === "income"
        ? transactionIncomes()
        : transactions(),
    expenses,
    incomes,
    loading: () => !!(expensesLoading() && incomesLoading()),
    error: () => transactions.error,
    refresh,
    filter,
    filters: { expense: expenseFilters, income: incomeFilters },
    filterByDateRange,
    create,
    update,
    delete: deleteTransaction,
    changeTab,
    currentTab,
  };
};
