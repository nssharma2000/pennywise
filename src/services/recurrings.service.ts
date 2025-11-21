import { db } from "~/db/schema";
import type { BooleanType, RecurringKind, RecurringType } from "~/types";

export const recurringService = {
  // Get all recurrings
  getAll: async (): Promise<RecurringType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
};
