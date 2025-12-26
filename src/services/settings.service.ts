import { db } from "~/db/schema";
import type { DBExportType, ProfileType } from "~/types";

export const profileService = {
  // Get profile (only one exists)
  get: async (): Promise<ProfileType | null> => {
    const profiles = await db.profile.toArray();
    return profiles[0] || null;
  },

  // Create or update profile
  save: async (
    data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">
  ): Promise<void> => {
    const existing = await profileService.get();

    if (existing) {
      await db.profile.update(existing.id, {
        ...data,
        updatedAt: new Date(),
      });
    } else {
      await db.profile.add({
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  },

  // Update specific fields
  update: async (data: Partial<ProfileType>): Promise<void> => {
    const existing = await profileService.get();
    if (existing) {
      await db.profile.update(existing.id, {
        ...data,
        updatedAt: new Date(),
      });
    }
  },
};

export const settingsService = {
  export: async (): Promise<DBExportType | null> => {
    console.log("Starting Export!");
    const profile = await db.profile.toArray().then((p) => (p ? p[0] : null));
    if (!profile) throw new Error("No Preferences set!");
    const expenses = await db.expenses.toArray();
    const incomes = await db.incomes.toArray();
    const recurrings = await db.recurrings.toArray();
    const transfers = await db.transfers.toArray();
    const accounts = await db.accounts.toArray();
    return { profile, expenses, incomes, recurrings, transfers, accounts };
  },

  import: async (data: DBExportType) => {
    try {
      console.log("Importing data now! \nIt will be populated in some time");
      // ? Safe Add: Upsert
      if (data.profile) db.profile.upsert(data.profile.id, data.profile);
      // TODO: Linking
      const accountsPromises = data.accounts.map((d) =>
        db.accounts.upsert(d.id, d)
      );
      const expensesPromises = data.expenses.map((d) =>
        db.expenses.upsert(d.id, d)
      );
      const incomesPromises = data.incomes.map((d) =>
        db.incomes.upsert(d.id, d)
      );
      const recurringsPromises = data.recurrings.map((d) =>
        db.recurrings.upsert(d.id, d)
      );
      const transfersPromises = data.transfers.map((d) =>
        db.transfers.upsert(d.id, d)
      );
      await Promise.all([
        ...accountsPromises,
        ...expensesPromises,
        ...incomesPromises,
        ...transfersPromises,
        ...recurringsPromises,
      ]);
    } catch (e) {
      console.error("Something Happened While importing", e);
    }
  },

  // Delete all stuff
  clear: async (id?: string): Promise<void> => {
    try {
      console.log("Clearing the DB");
      if (id) await db.profile.delete(id);
      await db.expenses.clear();
      await db.incomes.clear();
      await db.accounts.clear();
      await db.transfers.clear();
      await db.recurrings.clear();
      console.log("The Whole Database was cleared Successfully");
    } catch (e) {
      console.error("Something Happened while clearing DB", e);
      throw e;
    }
  },
};
