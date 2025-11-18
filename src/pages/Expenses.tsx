import { CreditCard, Plus } from "lucide-solid";
import { type Component, For, Show, createSignal } from "solid-js";
import EmptyState from "~/components/EmptyState";
import ExpenseCard from "~/components/ExpenseCard";
import ExpenseForm from "~/components/forms/ExpenseForm";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { useAccounts } from "~/hooks/useAccounts";
import { useExpenses } from "~/hooks/useExpenses";
import { useProfile } from "~/hooks/useProfiles";
import type { ExpenseType } from "~/types";

export const ExpenseCategories = [
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health" },
  { value: "others", label: "Others" },
] as const;

export const { accounts } = useAccounts();

const Expenses: Component = () => {
  const {
    expenses,
    loading,
    create,
    update,
    delete: deleteExpense,
  } = useExpenses();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingExpense, setIsAddingExpense] = createSignal(false);
  const [editingExpense, setEditingExpense] = createSignal<ExpenseType | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      await deleteExpense(id);
    }
  };

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Expenses</h2>
        <UIButton onClick={() => setIsAddingExpense(true)} class="">
          <Plus size={18} />
          Add Expense
        </UIButton>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && expenses()?.length === 0}>
        <EmptyState
          title="No expenses yet"
          text="Get started by adding your first expense"
          action={
            <UIButton onClick={() => setIsAddingExpense(true)} class="">
              Add Expense
            </UIButton>
          }
          icon={<CreditCard size={48} class="mx-auto text-gray-400" />}
        />
      </Show>

      {/* Expenses List */}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={expenses()}>
          {(expense) => (
            <ExpenseCard
              expense={expense}
              currency={currency}
              handleDelete={handleDelete}
              setEditingExpense={setEditingExpense}
            />
          )}
        </For>
      </div>

      <Show when={isAddingExpense() || editingExpense()}>
        <div
          onClick={() => {
            setIsAddingExpense(false);
            setEditingExpense(null);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-white text-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 class="text-xl font-semibold mb-4">
              {editingExpense() ? "Edit Expense" : "Add Expense"}
            </h3>
            <ExpenseForm
              expense={editingExpense() || undefined}
              onSubmit={async (data: Omit<ExpenseType, "id" | "createdAt">) => {
                if (editingExpense()) {
                  await update(editingExpense()!.id, data);
                } else {
                  await create(data);
                }
                setIsAddingExpense(false);
                setEditingExpense(null);
              }}
              onCancel={() => {
                setIsAddingExpense(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Expenses;
