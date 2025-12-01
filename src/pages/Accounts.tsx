import {
  CreditCard,
  FilterIcon,
  SettingsIcon,
  SortAscIcon,
} from "lucide-solid";
import { type Component, For, Show, createSignal } from "solid-js";
import AccountCard from "~/components/AccountCard";
import EmptyState from "~/components/EmptyState";
import AddButton from "~/components/FloatingButtons/AddButton";
import MenuButton from "~/components/FloatingButtons/MenuButton";
import AccountForm from "~/components/forms/AccountForm";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { useAccounts } from "~/hooks/useAccounts";
import { useProfile } from "~/hooks/useProfiles";
import type { AccountType } from "~/types";

export const AccountTypes = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_account", label: "Bank Account" },
] as const;

const Accounts: Component = () => {
  const {
    accounts,
    loading,
    create,
    update,
    delete: deleteAccount,
  } = useAccounts();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingAccount, setIsAddingAccount] = createSignal(false);
  const [editingAccount, setEditingAccount] = createSignal<AccountType | null>(
    null
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteAccount(id);
    }
  };

  return (
    <div class="space-y-4">
      <MenuButton
        position="bottom-right"
        items={[
          { label: "Settings", icon: SettingsIcon, onClick() {} },
          { label: "Sort", icon: SortAscIcon, onClick() {} },
          { label: "Filter", icon: FilterIcon, onClick() {} },
        ]}
      />
      <AddButton handleClick={() => setIsAddingAccount(true)} />
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Accounts</h2>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && accounts()?.length === 0}>
        <EmptyState
          title="No accounts yet"
          text="Get started by adding your first account"
          action={
            <UIButton onClick={() => setIsAddingAccount(true)} class="">
              Add Account
            </UIButton>
          }
          icon={<CreditCard size={48} class="mx-auto text-gray-400" />}
        />
      </Show>

      {/* Accounts List */}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={accounts()}>
          {(account) => (
            <AccountCard
              account={account}
              currency={currency}
              setEditingAccount={setEditingAccount}
              handleDelete={handleDelete}
            />
          )}
        </For>
      </div>

      <Show when={isAddingAccount() || editingAccount()}>
        <div
          onClick={() => {
            setIsAddingAccount(false);
            setEditingAccount(null);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-gray-900 text-gray-200 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col"
          >
            <h3 class="text-xl font-semibold mb-4">
              {editingAccount() ? "Edit Account" : "Add Account"}
            </h3>
            <AccountForm
              account={editingAccount() || undefined}
              onSubmit={async (data: Omit<AccountType, "id" | "createdAt">) => {
                if (editingAccount()) {
                  await update(editingAccount()!.id, data);
                } else {
                  await create(data);
                }
                setIsAddingAccount(false);
                setEditingAccount(null);
              }}
              onCancel={() => {
                setIsAddingAccount(false);
                setEditingAccount(null);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Accounts;
