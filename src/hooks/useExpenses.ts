import { createResource, createSignal } from "solid-js";
import { expenseService } from "~/services/expenses.service";
import { toast } from "~/components/ui/Toast";
import type { ExpenseType } from "~/types";

const checkString = (val?: string) => !!(val && val.trim().length > 0);

export const useExpenses = () => {
  const [trigger, setTrigger] = createSignal(0);
  const [category, setCategory] = createSignal("");
  const [accountID, setAccountID] = createSignal("");
  const [dateRange, setDateRange] = createSignal({ start: "", end: "" });

  const [expenses, { refetch }] = createResource(trigger, async () => {
    try {
      if (
        checkString(category()) &&
        checkString(accountID()) &&
        (checkString(dateRange().end) || checkString(dateRange().start))
      ) {
        return await expenseService.getByCategoryAndAccountAndDateRange(
          category(),
          accountID(),
          new Date(dateRange().start),
          new Date(dateRange().end),
        );
      }
      if (checkString(dateRange().end) || checkString(dateRange().start)) {
        return await expenseService.getByDateRange(
          new Date(dateRange().start),
          new Date(dateRange().end),
        );
      }
      if (checkString(category()) && checkString(accountID())) {
        return await expenseService.getByCategoryAndAccount(
          category(),
          accountID(),
        );
      }
      if (checkString(category())) {
        return await expenseService.getByCategory(category());
      }
      if (checkString(accountID())) {
        return await expenseService.getByAccount(accountID());
      }
      return await expenseService.getAll();
    } catch (error) {
      toast.error("Failed to load expenses");
      console.error(error);
      return [];
    }
  });

  const refresh = () => setTrigger((prev) => prev + 1);

  const filter = (category?: string, accountID?: string) => {
    if (
      category &&
      checkString(category) &&
      accountID &&
      checkString(accountID)
    ) {
      setCategory(category);
      setAccountID(accountID);
    } else if (category && checkString(category)) {
      setCategory(category);
      setAccountID("");
    } else if (accountID && checkString(accountID)) {
      setCategory("");
      setAccountID(accountID);
    }
    refresh();
  };

  const filterByDateRange = (start: string, end: string) => {
    if (checkString(start) && checkString(end)) {
      setDateRange({ start, end });
    }
    refresh();
  };

  const create = async (data: Omit<ExpenseType, "id" | "createdAt">) => {
    try {
      await expenseService.create(data);
      toast.success("Expense created successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to create expense");
      throw error;
    }
  };

  const update = async (id: string, data: Partial<ExpenseType>) => {
    try {
      await expenseService.update(id, data);
      toast.success("Expense updated successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to update expense");
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.delete(id);
      toast.success("Expense deleted");
      refresh();
    } catch (error) {
      toast.error("Failed to delete expense");
      throw error;
    }
  };

  return {
    expenses,
    loading: () => !!expenses.loading,
    error: () => expenses.error,
    refresh,
    create,
    update,
    filter,
    filters: { category, accountID, dateRange },
    filterByDateRange,
    delete: deleteExpense,
  };
};
