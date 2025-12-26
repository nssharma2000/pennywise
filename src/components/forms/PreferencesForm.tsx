import { createForm } from "@tanstack/solid-form";
import { Show, type Component } from "solid-js";
import { profileSchema, type ProfileFormData } from "~/lib/validations";
import type { ProfileType } from "~/types";
import UIButton from "../ui/Button";

interface PreferencesFormProps {
  profile?: ProfileType;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

const PreferencesForm: Component<PreferencesFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      monthlyIncome: props.profile?.monthlyIncome || 0,
      currency: props.profile?.currency || "₹",
    } as ProfileFormData,
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4"
    >
      {/* Currency */}
      <form.Field
        name="currency"
        validators={{
          onChange: profileSchema.shape.currency,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Currency</label>
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
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Monthly Income */}
      <form.Field
        name="monthlyIncome"
        validators={{
          onChange: profileSchema.shape.monthlyIncome,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Monthly Income</label>
            <input
              type="number"
              step="0.01"
              value={field().state.value || 0}
              onInput={(e) =>
                field().handleChange(parseFloat(e.target.value) || 0)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Monthly Budget */}
      <form.Field
        name="monthlyBudget"
        validators={{
          onChange: profileSchema.shape.monthlyBudget,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Monthly Budget</label>
            <input
              type="number"
              step="0.01"
              value={field().state.value || 0}
              onInput={(e) =>
                field().handleChange(parseFloat(e.target.value) || 0)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Actions */}
      <div class="flex gap-3 pt-4">
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
            : props.profile
            ? "Update"
            : "Create"}
        </UIButton>
      </div>
    </form>
  );
};

export default PreferencesForm;
