// src/services/recurrings.service.ts
import { endOfMonth, setDate, startOfMonth } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/db/schema";
import type { RecurringType } from "~/types";

function clampDayToMonth(day: number, date: Date) {
  // returns a Date in same month with day clamped to last day if needed
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  const d = Math.min(Math.max(1, day), lastDay);
  return setDate(date, d);
}

/**
 * Create a recurring template
 */
export async function createRecurring(
  payload: Omit<RecurringType, "id" | "createdAt">,
) {
  const id = uuidv4();
  const now = new Date();
  const doc: RecurringType = {
    ...payload,
    id,
    createdAt: now,
    installmentsPaid:
      payload.type === "emi" ? (payload.installmentsPaid ?? 0) : undefined,
    active: payload.active ?? true,
    lastTriggeredAt: null,
  } as RecurringType;

  await db.recurrings.add(doc);
  return doc;
}

/**
 * Delete a recurring template
 */
export async function deleteRecurring(id: string) {
  await db.recurrings.delete(id);
}

/**
 * Generate occurrences for a given month (Date anywhere in target month)
 * - For each active recurring template, create an Expense or Income occurrence if not already created.
 */
export async function generateRecurrencesForMonth(targetDate: Date) {
  // get all active recurrings
  const recurrings = await db.recurrings
    .where("active")
    .equals("true")
    .toArray();

  // month bounds
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);

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
      .and((item: any) => {
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
      await db.incomes.add({
        id: uuidv4(),
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
      await db.expenses.add({
        id: uuidv4(),
        accountId: r.accountId,
        amount: r.amount,
        category: r.category ?? (isEMI ? "EMI" : "Recurring Expense"),
        description: r.description,
        date: occurrenceDate,
        createdAt: new Date(),
        recurringId: r.id,
        isEMI: isEMI || false,
      });

      // if EMI: increment installmentsPaid and possibly deactivate
      if (r.type === "emi" && r.installments) {
        const updatedPaid = (r.installmentsPaid ?? 0) + 1;
        const update: Partial<RecurringType> = {
          installmentsPaid: updatedPaid,
        };

        if (updatedPaid >= r.installments) {
          update.active = false;
        }
        update.lastTriggeredAt = new Date();
        await db.recurrings.update(r.id, update);
      } else {
        // update lastTriggeredAt for non-emi
        await db.recurrings.update(r.id, { lastTriggeredAt: new Date() });
      }
    } // end expense
  } // end for
}
