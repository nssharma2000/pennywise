import { createForm } from "@tanstack/solid-form";
import { For, Show, createMemo, type Component } from "solid-js";
import { accountSchema, type AccountFormData } from "~/lib/validations";
import { AccountTypes } from "~/pages/Accounts";
import type { AccountType } from "~/types";
import UIButton from "../ui/Button";

interface AccountFormProps {
  account?: AccountType;
  onSubmit: (data: AccountFormData) => Promise<void>;
  onCancel: () => void;
}

const AccountForm: Component<AccountFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      name: props.account?.name || "",
      type: props.account?.type || "debit_card",
      balance: props.account?.balance || 0,
      creditLimit: props.account?.creditLimit || undefined,
      billingCycleStart: props.account?.billingCycleStart || undefined,
      billingCycleEnd: props.account?.billingCycleEnd || undefined,
    } as AccountFormData,
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  // Create a reactive memo for the account type
  const accountType = form.useStore((state) => state.values.type);
  const isCreditCard = createMemo(() => accountType() === "credit_card");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4"
    >
      {/* Account Name */}
      <form.Field
        name="name"
        validators={{
          onChange: accountSchema.shape.name,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              value={field().state.value}
              onInput={(e) => field().handleChange(e.target.value)}
              onBlur={() => field().handleBlur()}
              placeholder="e.g., Chase Credit Card"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.toString()}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Account Type */}
      <form.Field
        name="type"
        validators={{
          onChange: accountSchema.shape.type,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Account Type</label>
            <select
              value={field().state.value}
              onChange={(e) =>
                field().handleChange(e.target.value as AccountType["type"])
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none bg-gray-900"
            >
              <For each={AccountTypes}>
                {(type: (typeof AccountTypes)[number]) => (
                  <option value={type.value}>{type.label}</option>
                )}
              </For>
            </select>
          </div>
        )}
      </form.Field>

      {/* Balance (for debit/bank) */}
      <Show when={!isCreditCard()}>
        <form.Field name="balance">
          {(field) => (
            <Show when={form.state.values.type !== "credit_card"}>
              <div>
                <label class="block text-sm font-medium mb-1">Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={field().state.value || 0}
                  onInput={(e) =>
                    field().handleChange(parseFloat(e.target.value) || 0)
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
                />
              </div>
            </Show>
          )}
        </form.Field>
      </Show>

      {/* Credit Limit (for credit cards) */}
      <Show when={isCreditCard()}>
        <form.Field name="creditLimit">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">Credit Limit</label>
              <input
                type="number"
                step="0.01"
                value={field().state.value || 0}
                onInput={(e) =>
                  field().handleChange(parseFloat(e.target.value) || undefined)
                }
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
              />
            </div>
          )}
        </form.Field>
      </Show>
      {/* Billing Cycle (for credit cards) */}
      <Show when={isCreditCard()}>
        <div class="grid grid-cols-2 gap-4">
          <form.Field name="billingCycleStart">
            {(field) => (
              <div>
                <label class="block text-sm font-medium mb-1">
                  Cycle Start
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={field().state.value || ""}
                  onInput={(e) =>
                    field().handleChange(parseInt(e.target.value) || undefined)
                  }
                  placeholder="Day"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="billingCycleEnd">
            {(field) => (
              <div>
                <label class="block text-sm font-medium mb-1">Cycle End</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={field().state.value || ""}
                  onInput={(e) =>
                    field().handleChange(parseInt(e.target.value) || undefined)
                  }
                  placeholder="Day"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
                />
              </div>
            )}
          </form.Field>
        </div>
      </Show>

      {/* Actions */}
      <div class="w-full flex gap-3 pt-4">
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
            : props.account
            ? "Update"
            : "Create"}
        </UIButton>
      </div>
    </form>
  );
};

export default AccountForm;
