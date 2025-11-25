// src/hooks/useRecurringGenerator.ts
import { onCleanup, onMount } from "solid-js";
import { recurringService } from "~/services/recurrings.service";

/**
 * Call this once in the root component to ensure monthly occurrences are created.
 */
export function useRecurringGenerator() {
  async function generateNow() {
    try {
      console.log("Generating Recurring Transactions Now!!!");
      // generate for current month
      const stats = await recurringService.generateRecurringTransactions(
        new Date()
      );
      console.log("Successfully Generated Recurring Transactions!!!", stats);
    } catch (err) {
      console.error("Error generating recurrings:", err);
    }
  }

  onMount(() => {
    generateNow();

    const onVisibility = () => {
      if (!document.hidden) {
        generateNow();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    onCleanup(() =>
      document.removeEventListener("visibilitychange", onVisibility)
    );
  });
}
