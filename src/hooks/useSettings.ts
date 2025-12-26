import { createResource } from "solid-js";
import z from "zod";
import { toast } from "~/components/ui/Toast";
import { profileService, settingsService } from "~/services/settings.service";
import type { DBExportType, ProfileType } from "~/types";
import { dbExportSchema } from "~/utils/validation";

export const useSettings = () => {
  const [profile, { refetch }] = createResource(async () => {
    try {
      return await profileService.get();
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
      return null;
    }
  });

  const refresh = () => refetch();

  const save = async (
    data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await profileService.save(data);
      toast.success("Profile Saved successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to create account");
      throw error;
    }
  };

  const clearDB = async () => {
    try {
      const clearPromise = settingsService.clear(profile()?.id);
      toast.promise(clearPromise, {
        loading: "Clearing Database",
        success: () => "Successfully Cleared Database!",
        error: (e) => {
          console.log("Failed To clear Database :>> ", e);
          return "Failed To clear Database";
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return;
    }
  };

  const exportDB = async (): Promise<DBExportType | null> => {
    try {
      const exportPromise = settingsService.export();
      await toast.promise(exportPromise, {
        loading: "Exporting Database",
        success: () => {
          return "Successfully Exported Database!";
        },
        error: (e) => {
          console.log("Failed To export Database :>> ", e);
          return "Failed To export Database :> " + e.message;
        },
      });
      return exportPromise;
    } catch (error) {
      console.log("error :>> ", error);
      return null;
    }
  };
  const importDB = async (db: string) => {
    try {
      let payload: DBExportType = JSON.parse(db);
      const result = dbExportSchema.safeParse(payload);

      if (!result.success) {
        console.error(z.treeifyError(result.error));
        throw new Error("Invalid import file format");
      }
      const importPromise = settingsService.import(result.data);
      toast.promise(importPromise, {
        loading: "Importing Database",
        success: () => "Successfully Imported Database!",
        error: (e) => {
          console.log("Failed To import Database :>> ", e);
          return "Failed To import Database";
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      toast.error("Invalid or corrupted import data");
      return;
    }
  };

  return {
    profile,
    loading: () => !!profile.loading,
    error: () => profile.error,
    refresh,
    clearDB,
    exportDB,
    importDB,
    save,
  };
};
