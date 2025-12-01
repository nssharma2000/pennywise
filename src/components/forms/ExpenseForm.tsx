import { createForm } from "@tanstack/solid-form";
import { format } from "date-fns";
import { For, Show, type Component } from "solid-js";
import { expenseSchema, type ExpenseFormData } from "~/lib/validations";
import { ExpenseCategories, accounts } from "~/pages/Transactions";
import type { AccountType, ExpenseType } from "~/types";
import UIButton from "../ui/Button";

interface ExpenseFormProps {
  expense?: ExpenseType;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
}

const ExpenseForm: Component<ExpenseFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      accountId: props.expense?.accountId || "",
      amount: props.expense?.amount || 0,
      category: props.expense?.category || ExpenseCategories[0].value,
      description: props.expense?.description || "",
      date: props.expense?.date || new Date(),
    } as ExpenseFormData,
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4"
    >
      <form.Field
        name="amount"
        validators={{
          onChange: expenseSchema.shape.amount,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={field().state.value || 0}
              onInput={(e) =>
                field().handleChange(parseFloat(e.target.value) || 0)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{
          onChange: expenseSchema.shape.description,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={field().state.value}
              onInput={(e) => field().handleChange(e.target.value)}
              onBlur={() => field().handleBlur()}
              placeholder="e.g., Amazon: Portable Monitor"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <form.Field
        name="category"
        validators={{
          onChange: expenseSchema.shape.category,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Category</label>
            <select
              value={field().state.value}
              onChange={(e) => field().handleChange(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none bg-gray-900"
            >
              <For each={ExpenseCategories}>
                {(type: (typeof ExpenseCategories)[number]) => (
                  <option value={type.value}>{type.label}</option>
                )}
              </For>
            </select>
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <form.Field
        name="accountId"
        validators={{
          onChange: expenseSchema.shape.accountId,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Account</label>
            <select
              value={field().state.value}
              onChange={(e) => field().handleChange(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none bg-gray-900"
            >
              <option value="" disabled selected hidden>
                Select Account
              </option>
              <For each={accounts()}>
                {(account: AccountType) => (
                  <option value={account.id}>
                    {account.name}-{account.type.replaceAll("_", " ")}
                  </option>
                )}
              </For>
            </select>
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <form.Field
        name="date"
        validators={{
          onChange: expenseSchema.shape.date,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={format(field().state.value, "yyyy-MM-dd")}
              onInput={(e) => {
                const dString = e.target.value;
                const d = new Date(dString);
                field().handleChange(d);
              }}
              onBlur={() => field().handleBlur()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Actions */}
      <div class="flex gap-3 pt-4">
        <UIButton
          type="button"
          onClick={props.onCancel}
          class="w-full items-center justify-center bg-slate-500!"
        >
          Cancel
        </UIButton>
        <UIButton
          type="submit"
          disabled={form.state.isSubmitting}
          class="disabled:opacity-50 disabled:cursor-not-allowed w-full items-center justify-center"
        >
          {form.state.isSubmitting
            ? "Saving..."
            : props.expense
            ? "Update"
            : "Create"}
        </UIButton>
      </div>
    </form>
  );
};

export default ExpenseForm;
