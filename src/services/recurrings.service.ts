import { endOfMonth, startOfMonth } from "date-fns";
import { db } from "~/db/schema";
import { clampDayToMonth } from "~/lib/utils";
import type {
  BooleanType,
  ExpenseType,
  IncomeType,
  RecurringKind,
  RecurringType,
} from "~/types";

export const recurringService = {
  // Get all recurrings
  getAll: async (): Promise<RecurringType[]> => {
    return await db.recurrings.orderBy("createdAt").reverse().toArray();
  },

  // Get recurrings by account
  getByAccount: async (accountId: string): Promise<RecurringType[]> => {
    return await db.recurrings
      .where("accountId")
      .equals(accountId)
      .sortBy("createdAt");
  },

  // Get recurrings by type
  getByType: async (type: RecurringKind): Promise<RecurringType[]> => {
    return await db.recurrings.where("type").equals(type).sortBy("createdAt");
  },

  // Get recurrings in date range
  getByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<RecurringType[]> => {
    return await db.recurrings
      .where("startDate")
      .between(startDate, endDate, true, true)
      .and((r) => r.type === "emi")
      .toArray();
  },

  // Get recurrings by isActive
  getByIsActive: async (isActive: BooleanType): Promise<RecurringType[]> => {
    return await db.recurrings.where("isActive").equals(isActive).toArray();
  },
  // Get recurrings by category
  getByCategory: async (category: string): Promise<RecurringType[]> => {
    return await db.recurrings.where("category").equals(category).toArray();
  },

  // Create recurring
  create: async (
    data: Omit<RecurringType, "id" | "createdAt" | "isActive">
  ): Promise<string> => {
    const recurring: RecurringType = {
      id: crypto.randomUUID(),
      ...data,
      isActive: 1,
      createdAt: new Date(),
    };
    return await db.recurrings.add(recurring);
  },

  // Update recurring
  update: async (id: string, data: Partial<RecurringType>): Promise<void> => {
    await db.recurrings.update(id, data);
  },
  markActive: async (id: string): Promise<void> => {
    await db.recurrings.update(id, { isActive: 1 });
  },

  // Delete recurring
  markInactive: async (id: string): Promise<void> => {
    await db.recurrings.update(id, { isActive: 0 });
  },
  delete: async (id: string): Promise<void> => {
    await db.expenses.where("recurringId").equals(id).delete();
    await db.recurrings.delete(id);
  },

  // Get total recurrings
  getTotalAmount: async (): Promise<number> => {
    const recurrings = await db.recurrings.toArray();
    return recurrings.reduce((sum, exp) => sum + exp.amount, 0);
  },
  getTotalEMIs: async (): Promise<number> => {
    const recurrings = await db.recurrings
      .where("type")
      .equals("emi")
      .toArray();
    return recurrings.reduce((sum, exp) => sum + exp.amount, 0);
  },
  getTotalRecurringExpenses: async (): Promise<number> => {
    const recurrings = await db.recurrings
      .where("type")
      .equals("expense")
      .toArray();
    return recurrings.reduce((sum, exp) => sum + exp.amount, 0);
  },
  getTotalRecurringIncomes: async (): Promise<number> => {
    const recurrings = await db.recurrings
      .where("type")
      .equals("income")
      .toArray();
    return recurrings.reduce((sum, exp) => sum + exp.amount, 0);
  },

  generateRecurringTransactions: async (now: Date) => {
    const stats = { incomes: 0, emis: 0, expenses: 0 };
    const recurrings = await db.recurrings
      .where("isActive")
      .equals(1)
      .toArray();

    // month bounds
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    for (const r of recurrings) {
      // if the recurring has a startDate and it's in future, skip
      if (r.startDate && r.startDate > monthEnd) continue;

      // if EMI and finished, skip
      if (
        r.type === "emi" &&
        r.installments &&
        (r.installmentsPaid ?? 0) >= r.installments
      ) {
        continue;
      }

      const occurrenceDate = clampDayToMonth(r.dayOfMonth, monthStart);

      // check if there is already an expense/income for this recurringId in this month
      const exists = await db
        .table(r.type === "income" ? "incomes" : "expenses")
        .where("recurringId")
        .equals(r.id)
        .and((item: ExpenseType | IncomeType) => {
          const d = new Date(item.date);
          return (
            d.getFullYear() === occurrenceDate.getFullYear() &&
            d.getMonth() === occurrenceDate.getMonth()
          );
        })
        .count();

      if (exists > 0) {
        // already generated this month
        continue;
      }

      // create occurrence
      if (r.type === "income") {
        stats.incomes += 1;
        await db.incomes.add({
          id: crypto.randomUUID(),
          accountId: r.accountId,
          amount: r.amount,
          category: r.category ?? "Recurring Income",
          description: r.description,
          date: occurrenceDate,
          createdAt: new Date(),
          recurringId: r.id,
        });
      } else {
        // expense or emi
        const isEMI = r.type === "emi";
        if (isEMI) stats.emis += 1;
        else stats.expenses += 1;
        await db.expenses.add({
          id: crypto.randomUUID(),
          accountId: r.accountId,
          amount: r.amount,
          category: r.category ?? (isEMI ? "EMI" : "Recurring Expense"),
          description: r.description,
          date: occurrenceDate,
          createdAt: new Date(),
          recurringId: r.id,
          isEMI: isEMI ? 1 : 0,
        });

        // if EMI: increment installmentsPaid and possibly deactivate
        if (r.type === "emi" && r.installments) {
          const updatedPaid = (r.installmentsPaid ?? 0) + 1;
          const update: Partial<RecurringType> = {
            installmentsPaid: updatedPaid,
          };

          if (updatedPaid >= r.installments) {
            update.isActive = 0;
          }
          update.lastTriggeredAt = new Date();
          await db.recurrings.update(r.id, update);
        } else {
          // update lastTriggeredAt for non-emi
          await db.recurrings.update(r.id, { lastTriggeredAt: new Date() });
        }
      }
    }
    return stats;
  },
};
