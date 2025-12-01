import {
  createEffect,
  createMemo,
  createSignal,
  type Accessor,
} from "solid-js";
import type {
  TransactionEntity,
  TransactionKind,
  TransactionType,
} from "~/hooks/useTransactions";
import type { ExpenseType, IncomeType, TransferType } from "~/types";
import ExpenseForm from "./forms/ExpenseForm";
import IncomeForm from "./forms/IncomeForm";
import TransferForm from "./forms/TransferForm";
import UITabs from "./ui/Tabs";

const TRANSACTION_FORMS: TransactionKind[] = ["expense", "income", "transfer"];

const TransactionForm = ({
  selectedData,
  handleSubmit,
  handleCancel,
}: {
  selectedData: Accessor<TransactionType | null>;
  handleSubmit: (
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => Promise<void>;
  handleCancel: () => void;
}) => {
  const [currentForm, setCurrentForm] = createSignal<TransactionKind>(
    TRANSACTION_FORMS[0]
  );

  const isEditing = createMemo(
    () => !!(selectedData() && selectedData()?.transactionKind)
  );

  createEffect(() => {
    if (selectedData() && selectedData()?.transactionKind) {
      setCurrentForm(selectedData()!.transactionKind);
    }
  });

  return (
    <>
      <UITabs
        tabs={[
          {
            // expense
            label: TRANSACTION_FORMS[0],
            value: TRANSACTION_FORMS[0],
            content: (
              <ExpenseForm
                expense={(selectedData() as ExpenseType) ?? undefined}
                onSubmit={(d) => handleSubmit(d, TRANSACTION_FORMS[0])}
                onCancel={handleCancel}
              />
            ),
          },
          {
            // income
            label: TRANSACTION_FORMS[1],
            value: TRANSACTION_FORMS[1],
            content: (
              <IncomeForm
                income={(selectedData() as IncomeType) ?? undefined}
                onSubmit={(d) => handleSubmit(d, TRANSACTION_FORMS[1])}
                onCancel={handleCancel}
              />
            ),
          },
          {
            // transfer
            label: TRANSACTION_FORMS[2],
            value: TRANSACTION_FORMS[2],
            content: (
              <TransferForm
                transfer={(selectedData() as TransferType) ?? undefined}
                onSubmit={(d) => handleSubmit(d, TRANSACTION_FORMS[2])}
                onCancel={handleCancel}
              />
            ),
          },
        ]}
        currentTab={currentForm}
        setCurrentTab={setCurrentForm}
        disabled={isEditing()}
      />
    </>
  );
};

export default TransactionForm;
