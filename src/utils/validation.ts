import { z } from "zod";

const booleanValidation = z.union([z.literal(0), z.literal(1)]).optional();

const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["credit_card", "debit_card", "bank_account"]),
  balance: z.number().optional(),
  creditLimit: z.number().optional(),
  billingCycleStart: z.number().optional(),
  billingCycleEnd: z.number().optional(),
  createdAt: z.coerce.date(),
});

const expenseSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  amount: z.number(),
  category: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  isEMI: booleanValidation,
  recurringId: z.string().optional(),
  transferID: z.string().optional(),
  createdAt: z.coerce.date(),
});

const incomeSchema = z.object({
  id: z.string(),
  accountId: z.string().optional(),
  amount: z.number(),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.coerce.date(),
  recurringId: z.string().optional(),
  transferID: z.string().optional(),
  createdAt: z.coerce.date(),
});

const recurringSchema = z.object({
  id: z.string(),
  dayOfMonth: z.number(),
  amount: z.number(),
  accountId: z.string(),
  description: z.string(),
  type: z.enum(["expense", "income", "emi"]),
  isActive: booleanValidation,
  category: z.string().optional(),
  installments: z.number().optional(),
  installmentsPaid: z.number().optional(),
  monthlyAmount: z.number().optional(),
  startDate: z.coerce.date().optional(),
  lastTriggeredAt: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
});

const transferSchema = z.object({
  id: z.string(),
  fromAccountID: z.string(),
  toAccountID: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  description: z.string().optional(),
  createdAt: z.coerce.date(),
});

const profileSchema = z.object({
  id: z.string(),
  monthlyIncome: z.number(),
  currency: z.string(),
  monthlyBudget: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const dbExportSchema = z.object({
  accounts: z.array(accountSchema),
  expenses: z.array(expenseSchema),
  incomes: z.array(incomeSchema),
  transfers: z.array(transferSchema),
  recurrings: z.array(recurringSchema),
  profile: profileSchema,
});
