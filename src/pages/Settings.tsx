import { A } from "@solidjs/router";
import { ChevronRight, Copy, Pencil, TriangleAlertIcon } from "lucide-solid";
import { createMemo, createSignal, Show, type Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";
import EmptyState from "~/components/EmptyState";
import PreferencesForm from "~/components/forms/PreferencesForm";
import Modal from "~/components/Modal";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { toast } from "~/components/ui/Toast";
import { useSettings } from "~/hooks/useSettings";
import type { DBExportType, ProfileType } from "~/types";

const Profile: Component = () => {
  const [isModifyingProfile, setIsModifyingProfile] = createSignal(false);
  const [isExportModal, setIsExportModal] = createSignal<DBExportType | null>(
    null
  );
  const [isImportModal, setIsImportModal] = createSignal(false);

  const { profile, loading, save, clearDB, exportDB, importDB } = useSettings();

  const handleClearDB = () => {
    const resp = confirm("Are you sure you want to clear all data?");
    if (resp) {
      clearDB();
    }
  };
  const handleImportDB = async (
    e: SubmitEvent & {
      currentTarget: HTMLFormElement;
      target: DOMElement;
    }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const importData = data.get("import_data") as string;
    // ? Validate data and then call import
    if (!importData || !importData.length) return;
    await importDB(importData);
    // TODO: Close Modal
  };
  const handleCopy = () => {
    if (window && navigator) {
      const copyPromise = navigator.clipboard.writeText(
        JSON.stringify(isExportModal())
      );
      toast.promise(copyPromise, {
        loading: "Copying...",
        success: () => "Copied to clipboard",
        error: () => "Something went wrong",
      });
    }
  };
  const handleExportDB = async () => {
    const resp = await exportDB();
    console.log("resp :>> ", resp);
    setIsExportModal(resp);
  };

  const isShowExportModal = createMemo(() => !!isExportModal());

  return (
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between border-b border-b-slate-800 pb-1">
          <h2 class="text-lg">Preferences</h2>
          <UIButton
            onClick={() => setIsModifyingProfile(true)}
            class="bg-transparent! p-1!"
          >
            <Pencil size={16} />
          </UIButton>
        </div>
        {/* Empty State */}
        <Show when={!loading() && !profile()}>
          <EmptyState
            title="Preferences not set yet"
            text=""
            action={null}
            icon={null}
            small
          />
        </Show>
        <Show when={!loading() && profile()}>
          <div class="flex flex-col gap-2">
            <p class="text-gray-200 w-full flex justify-between">
              Currency: <span class="font-bold">{profile()?.currency}</span>
            </p>
            <p class="text-gray-200 w-full flex justify-between">
              Total Income:{" "}
              <span class="font-bold">
                {profile()?.currency} {profile()?.monthlyIncome}
              </span>
            </p>
            <p class="text-gray-200 w-full flex justify-between">
              Total Budget:{" "}
              <span class="font-bold">
                {profile()?.currency} {profile()?.monthlyBudget}
              </span>
            </p>
          </div>
        </Show>
      </div>
      <A
        href="/recurrings"
        class="flex justify-between border-b border-b-slate-800 pb-1"
      >
        <p class="text-md">Recurring Transactions</p>
        <UIButton class="bg-transparent! p-1!">
          <ChevronRight size={16} />
        </UIButton>
      </A>
      <div
        class="flex justify-between border-b border-b-slate-800 pb-1"
        onClick={() => setIsImportModal(true)}
      >
        <p class="text-md">Import Database!</p>
        <UIButton class="bg-transparent! p-1!">
          <ChevronRight size={16} />
        </UIButton>
      </div>
      <div
        class="flex justify-between border-b border-b-slate-800 pb-1"
        onClick={handleExportDB}
      >
        <p class="text-md">Export Database!</p>
        <UIButton class="bg-transparent! p-1!">
          <ChevronRight size={16} />
        </UIButton>
      </div>
      <div
        class="flex justify-between border-b border-b-slate-800 pb-1 text-red-400!"
        onClick={handleClearDB}
      >
        <p class="text-md">Clear Database!</p>
        <UIButton class="bg-transparent! p-1! text-red-400!">
          <TriangleAlertIcon size={16} />
        </UIButton>
      </div>
      <Modal
        isOpen={isModifyingProfile}
        handleClose={() => {
          setIsModifyingProfile(false);
        }}
        title={"Save Preferences"}
      >
        <PreferencesForm
          profile={profile() || undefined}
          onSubmit={async (
            data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">
          ) => {
            await save(data);
            setIsModifyingProfile(false);
          }}
          onCancel={() => {
            setIsModifyingProfile(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={isShowExportModal}
        handleClose={() => {
          setIsExportModal(null);
        }}
        title={"Exported Data"}
      >
        <div class="flex justify-between gap-2 mb-4">
          <p class="font-light text-sm">
            You can Copy the data and paste in on your other device to sync data
          </p>
          <UIButton class="bg-gray-600! p-1! px-2!" onClick={handleCopy}>
            <Copy size={16} />
          </UIButton>
        </div>
        <code>
          <pre>{JSON.stringify(isExportModal(), undefined, 2)}</pre>
        </code>
      </Modal>
      <Modal
        isOpen={isImportModal}
        handleClose={() => {
          setIsImportModal(false);
        }}
        title={"Import Data"}
      >
        <form onSubmit={handleImportDB} class="space-y-4">
          <textarea
            name="import_data"
            id="import_data"
            rows={4}
            placeholder="Paste your data json"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent focus-visible:outline-none"
            autofocus
          />
          <UIButton type="submit">Save</UIButton>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
