import { CreditCard, Plus } from "lucide-solid";
import { type Component, For, Show, createSignal } from "solid-js";
import EmptyState from "~/components/EmptyState";
import RecurringForm from "~/components/forms/RecurringForm";
import RecurringCard from "~/components/RecurringCard";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { useAccounts } from "~/hooks/useAccounts";
import { useProfile } from "~/hooks/useProfiles";
import { useRecurrings } from "~/hooks/useRecurrings";
import type { RecurringKind, RecurringType } from "~/types";

export const { accounts } = useAccounts();

export const RecurringTypes: { value: RecurringKind; label: string }[] = [
  { value: "emi", label: "EMI" },
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
] as const;

const Recurrings: Component = () => {
  const {
    recurrings,
    loading,
    create,
    update,
    delete: deleteRecurring,
    toggle,
  } = useRecurrings();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingRecurring, setIsAddingRecurring] = createSignal(false);
  const [editingRecurring, setEditingRecurring] =
    createSignal<RecurringType | null>(null);

  const handleDelete = async (id: string) => {
    if (
      confirm(
        `Are you sure you want to delete this? It will also remove all related transactions`
      )
    ) {
      await deleteRecurring(id);
    }
  };
  const handleRecurringToggle = async (id: string, v: boolean) => {
    await toggle(id, v);
  };

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Recurring Transactions</h2>
        <UIButton onClick={() => setIsAddingRecurring(true)} class="">
          <Plus size={18} />
          Add Recurring
        </UIButton>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && recurrings()?.length === 0}>
        <EmptyState
          title="No Recurring Transactions yet"
          text="Get started by adding your first recurring expense or income."
          action={
            <UIButton onClick={() => setIsAddingRecurring(true)} class="">
              Add Recurring Transaction
            </UIButton>
          }
          icon={<CreditCard size={48} class="mx-auto text-gray-400" />}
        />
      </Show>

      {/* Recurrings List */}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={recurrings()}>
          {(recurring) => (
            <RecurringCard
              recurring={recurring}
              currency={currency}
              handleDelete={handleDelete}
              setEditingRecurring={setEditingRecurring}
              handleRecurringToggle={(v) =>
                handleRecurringToggle(recurring.id, v)
              }
            />
          )}
        </For>
      </div>

      <Show when={isAddingRecurring() || editingRecurring()}>
        <div
          onClick={() => {
            setIsAddingRecurring(false);
            setEditingRecurring(null);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-gray-900 text-gray-200 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col"
          >
            <h3 class="text-xl font-semibold mb-4">
              {editingRecurring()
                ? "Edit Recurring"
                : "Add a Recurring Transaction"}
            </h3>
            <RecurringForm
              recurring={editingRecurring() || undefined}
              onSubmit={async (
                data: Omit<RecurringType, "id" | "createdAt" | "isActive">
              ) => {
                if (editingRecurring()) {
                  await update(editingRecurring()!.id, data);
                } else {
                  await create(data);
                }
                setIsAddingRecurring(false);
                setEditingRecurring(null);
              }}
              onCancel={() => {
                setIsAddingRecurring(false);
                setEditingRecurring(null);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Recurrings;
