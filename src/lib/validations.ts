import { z } from "zod";

export const profileSchema = z.object({
  monthlyIncome: z.number().min(0, "Income must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["credit_card", "debit_card", "bank_account"]),
  balance: z.number().optional(),
  creditLimit: z.number().optional(),
  billingCycleStart: z.number().min(1).max(31).optional(),
  billingCycleEnd: z.number().min(1).max(31).optional(),
});

export const expenseSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;

export const baseRecurring = z.object({
  dayOfMonth: z.number().min(1).max(31),
  amount: z.number().positive(),
  accountId: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const recurringCreateSchema = baseRecurring
  .extend({
    type: z.enum(["expense", "income", "emi"]),
    // EMI fields (optional but required if type === 'emi')
    totalAmount: z.number().positive().optional(),
    installments: z.number().int().positive().optional(),
    startDate: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.type === "emi") {
      if (!data.totalAmount)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "EMI requires totalAmount",
        });
      if (!data.installments)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "EMI requires installments",
        });
    }
  });

export type RecurringFormData = z.infer<typeof recurringCreateSchema>;
