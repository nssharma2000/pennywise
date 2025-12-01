import { CreditCard, Pencil, PiggyBank, Trash2 } from "lucide-solid";
import { Show, type Component, type Setter } from "solid-js";
import type { AccountType } from "~/types";
import UIButton from "./ui/Button";

type AccountCardPropsType = {
  account: AccountType;
  currency: string;
  setEditingAccount: Setter<AccountType | null>;
  handleDelete: (id: string, name: string) => Promise<void>;
};

const AccountCard: Component<AccountCardPropsType> = ({
  account,
  currency,
  setEditingAccount,
  handleDelete,
}) => {
  const getAccountIcon = (type: AccountType["type"]) => {
    return type === "bank_account" ? (
      <PiggyBank size={24} />
    ) : (
      <CreditCard size={24} />
    );
  };
  return (
    <div class="bg-slate-900 text-gray-300 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Account Header */}
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-slate-800 rounded-lg text-purple-600">
            {getAccountIcon(account.type)}
          </div>
          <div>
            <h3 class="font-semibold text-lg">{account.name}</h3>
            <p class="text-sm text-gray-500 capitalize">
              {account.type.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div class="space-y-2 mb-4">
        <Show when={account.type === "credit_card" && account.creditLimit}>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Credit Limit:</span>
            <span class="font-medium">
              {currency}
              {account.creditLimit?.toFixed(2)}
            </span>
          </div>
        </Show>

        <Show when={account.balance !== undefined}>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Balance:</span>
            <span class="font-medium">
              {currency}
              {account.balance?.toFixed(2)}
            </span>
          </div>
        </Show>

        <Show when={account.billingCycleStart && account.billingCycleEnd}>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Billing Cycle:</span>
            <span class="font-medium">
              {account.billingCycleStart} - {account.billingCycleEnd}
            </span>
          </div>
        </Show>
      </div>

      {/* Actions */}
      <div class="flex gap-2">
        <UIButton
          onClick={() => setEditingAccount(account)}
          class="bg-gray-600! hover:bg-gray-700! text-sm flex-1 text-slate-300!"
        >
          <Pencil size={16} />
          Edit
        </UIButton>
        <UIButton
          onClick={() => handleDelete(account.id, account.name)}
          class="bg-gray-700! hover:bg-gray-800! text-red-400!"
        >
          <Trash2 size={16} />
          Delete
        </UIButton>
      </div>
    </div>
  );
};

export default AccountCard;
