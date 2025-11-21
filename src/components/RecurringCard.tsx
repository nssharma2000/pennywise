import { ToggleButton } from "@kobalte/core/toggle-button";
import { format } from "date-fns";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  HandCoins,
  Pencil,
  ShieldBan,
  ShieldCheck,
  Trash2,
} from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { accounts } from "~/pages/Recurrings";
import type { RecurringType } from "~/types";
import UIButton from "./ui/Button";

const RecurringCard = ({
  recurring,
  currency,
  handleDelete,
  setEditingRecurring,
  handleRecurringToggle,
}: {
  recurring: RecurringType;
  currency: string;
  setEditingRecurring: (recurring: RecurringType) => void;
  handleDelete: (recurringId: string) => void;
  handleRecurringToggle: (v: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const account = createMemo(() =>
    accounts()?.find((acc) => acc.id === recurring.accountId)
  );
  const colors = {
    border: !recurring.isActive
      ? "border-slate-400"
      : recurring.type === "income"
      ? "border-lime-400"
      : recurring.type === "expense"
      ? "border-yellow-400"
      : "border-red-400",
    bg: !recurring.isActive
      ? "bg-slate-950"
      : recurring.type === "income"
      ? "bg-emerald-50"
      : recurring.type === "expense"
      ? "bg-yellow-50"
      : "bg-orange-100",
    icon: {
      text: !recurring.isActive
        ? "text-slate-600"
        : recurring.type === "income"
        ? "text-emerald-600"
        : recurring.type === "expense"
        ? "text-yellow-600"
        : "text-orange-600",
      bg: !recurring.isActive
        ? "bg-slate-900"
        : recurring.type === "income"
        ? "bg-lime-100"
        : recurring.type === "expense"
        ? "bg-yellow-100"
        : "bg-red-200",
    },
    toggle: {
      bg: recurring.isActive ? "bg-slate-900" : "bg-slate-900",
      text: recurring.isActive ? "text-lime-400" : "text-rose-400",
    },
  };

  const icon =
    recurring.type === "income" ? (
      <BanknoteArrowDown />
    ) : recurring.type === "expense" ? (
      <BanknoteArrowUp />
    ) : (
      <HandCoins />
    );

  return (
    <div
      class={`text-gray-700 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${colors.bg} ${colors.border} `}
    >
      {/* Recurring Header */}
      <div
        class="flex items-start justify-between mb-3"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div class="flex items-center gap-3 w-full">
          <div class={`p-2 rounded-lg ${colors.icon.bg} ${colors.icon.text}`}>
            {icon}
          </div>
          <div>
            <h3 class="font-semibold text-lg">
              {currency}
              {recurring.amount}
            </h3>
            <div class="flex-1 flex flex-col items-start justify-center">
              <p class="text-sm text-gray-500">
                On every {recurring.dayOfMonth}th of month
              </p>
            </div>
          </div>
          <div class="flex-1 flex flex-col items-end justify-center">
            <span>Account:</span>
            <p class="text-sm text-gray-500 capitalize">{account()?.name}</p>
          </div>
        </div>
      </div>
      <Show when={isExpanded()}>
        {/* Recurring Details */}
        <div class="flex flex-col gap-2">
          <Show when={!!recurring.category}>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Category:</span>
              <span class="font-medium">{recurring.category}</span>
            </div>
          </Show>
          <Show when={!!recurring.startDate}>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Started At:</span>
              <p class="text-sm capitalize">
                {format(recurring.startDate!, "PP")}
              </p>
            </div>
          </Show>
          <Show when={!!recurring.lastTriggeredAt}>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Next At:</span>
              <p class="text-sm capitalize">
                {format(recurring.lastTriggeredAt!, "PP")}
              </p>
            </div>
          </Show>
          <Show when={recurring.totalAmount ?? false}>
            <div class="flex text-sm gap-1">
              <span class="text-gray-600">Remaining</span>
              <span class="underline underline-offset-4">
                {currency}
                {(recurring.totalAmount || 0) -
                  (recurring.monthlyAmount || 0) *
                    (recurring.installmentsPaid || 0)}
              </span>
              <span class="text-gray-600">out of</span>
              <span class="underline underline-offset-4">
                {currency}
                {recurring.totalAmount}
              </span>
            </div>
          </Show>
          <Show when={recurring.installments ?? false}>
            <div class="flex text-sm gap-1">
              <span class="text-gray-600">Remaining</span>
              <span class="underline underline-offset-4">
                {(recurring.installments || 0) -
                  (recurring.installmentsPaid || 0)}{" "}
                Installments
              </span>
              <span class="text-gray-600">out of</span>
              <span class="underline underline-offset-4">
                {recurring.installments} Installments
              </span>
            </div>
          </Show>
          <div class="space-y-2">
            <div class="flex flex-col gap-1 text-sm">
              <span class="text-gray-600">Description:</span>
              <span class="font-medium">{recurring.description}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-2 mt-4">
          <ToggleButton
            class={`toggle-button ${colors.toggle.bg} ${colors.toggle.text} rounded-lg p-2`}
            aria-label="IsActive"
            pressed={!!recurring.isActive}
            onChange={handleRecurringToggle}
          >
            {(state) => (
              <Show when={state.pressed()} fallback={<ShieldBan />}>
                <ShieldCheck />
              </Show>
            )}
          </ToggleButton>
          <UIButton
            onClick={() => setEditingRecurring(recurring)}
            class="bg-gray-200! hover:bg-gray-300! text-sm flex-1 text-slate-900!"
          >
            <Pencil size={16} />
            Edit
          </UIButton>
          <UIButton
            onClick={() => handleDelete(recurring.id)}
            class="bg-red-100! hover:bg-red-200! text-red-600!"
          >
            <Trash2 size={16} />
            Delete
          </UIButton>
        </div>
      </Show>
    </div>
  );
};

export default RecurringCard;
