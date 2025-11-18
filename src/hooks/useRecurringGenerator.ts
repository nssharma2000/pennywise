// src/hooks/useRecurringGenerator.ts
import { onMount, onCleanup } from "solid-js";
import { generateRecurrencesForMonth } from "~/services/recurrings.service";
/**
 * Call this once in the root component to ensure monthly occurrences are created.
 */
export function useRecurringGenerator() {
  async function generateNow() {
    try {
      // generate for current month
      await generateRecurrencesForMonth(new Date());
      // Optional: generate for previous month if you want to backfill
      // await generateRecurrencesForMonth(subMonths(new Date(), 1));
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
      document.removeEventListener("visibilitychange", onVisibility),
    );
  });
}
