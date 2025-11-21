import { createResource, createSignal } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { checkString } from "~/lib/utils";
import { recurringService } from "~/services/recurrings.service";
import type { BooleanType, RecurringKind, RecurringType } from "~/types";

type RecurringFilterType = {
  isActive: BooleanType | -1;
  type: RecurringKind | "";
  accountID: string;
};

const fetchRecurrings = async (filters: RecurringFilterType) => {
  const { isActive, accountID, type } = filters;
  try {
    if (checkString(accountID)) {
      return await recurringService.getByAccount(accountID);
    }
    if (checkString(type)) {
      return await recurringService.getByType(type as RecurringKind);
    }
    if (isActive >= 0) {
      return await recurringService.getByIsActive(isActive as BooleanType);
    }
    return await recurringService.getAll();
  } catch (err) {
    toast.error("Failed to load recurrings");
    console.error(err);
    return [];
  }
};

export const useRecurrings = () => {
  const [filters, setFilters] = createSignal<RecurringFilterType>({
    type: "",
    accountID: "",
    isActive: -1,
  });

  const [recurrings, { refetch }] = createResource(filters, fetchRecurrings);

  const filter = (cat?: string, acc?: string) => {
    setFilters((p) => ({ ...p, category: cat ?? "", accountID: acc ?? "" }));
  };

  const filterByDateRange = (start: string, end: string) => {
    setFilters((p) => ({ ...p, dateRange: { start, end } }));
  };

  const create = async (
    data: Omit<RecurringType, "id" | "createdAt" | "isActive">
  ) => {
    try {
      await recurringService.create(data);
      toast.success("Recurring created successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to create recurring");
      throw error;
    }
  };

  const update = async (id: string, data: Partial<RecurringType>) => {
    try {
      await recurringService.update(id, data);
      toast.success("Recurring updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update recurring");
      throw error;
    }
  };

  const deleteRecurring = async (id: string) => {
    try {
      await recurringService.delete(id);
      toast.success("Recurring deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete recurring");
      throw error;
    }
  };
  const toggle = async (id: string, v: boolean) => {
    try {
      if (v) {
        await recurringService.markActive(id);
        toast.success("Recurring Activated");
      } else {
        await recurringService.markInactive(id);
        toast.success("Recurring Deactivated");
      }
      refetch();
    } catch (error) {
      toast.error("Failed to update recurring");
      throw error;
    }
  };

  return {
    recurrings,
    loading: () => !!recurrings.loading,
    error: () => recurrings.error,
    refresh: refetch,
    create,
    update,
    filter,
    filters,
    filterByDateRange,
    delete: deleteRecurring,
    toggle,
  };
};
