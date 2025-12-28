import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import BackButton from "~/components/FloatingButtons/BackButton";

const Section = (props: { title: string; children: any }) => (
  <div class="mb-8">
    <h2 class="text-lg font-medium text-[#646cff] mb-2">{props.title}</h2>
    <div class="space-y-2 text-sm text-gray-400">{props.children}</div>
  </div>
);

const SubSection = (props: { title: string; children: any }) => (
  <div class="mt-4">
    <h3 class="text-sm font-medium text-[#e2d7ff] mb-1 ml-1">{props.title}</h3>
    <div class="space-y-1 text-sm text-gray-400 ml-2">{props.children}</div>
  </div>
);

const Divider = () => (
  <div class="mt-2 mb-4 h-px w-full bg-linear-to-r from-transparent via-[#646cff]/40 to-transparent" />
);

const GuidePage: Component = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      <BackButton handleClick={handleBack} position={{ y: "60px" }} />
      <div class="min-h-screen bg-[#06040b] text-[#e2d7ff] px-6 py-8">
        {/* Header */}
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-semibold">PennyWise Guide</h1>
            <p class="text-sm text-gray-400 mt-1">
              A quick overview to help you get started.
            </p>
          </div>
        </div>

        <Divider />

        {/* What is PennyWise */}
        <Section title="What is PennyWise?">
          <p>PennyWise is a local-only expense manager.</p>
          <p>Everything runs in your browser and stays on your device.</p>
          <p>There is no login, no cloud, and no automatic sync.</p>
        </Section>

        {/* Accounts */}
        <Section title="1. Add Your First Account">
          <p>Accounts represent where your money lives.</p>

          <ul class="list-disc list-inside ml-1">
            <li>Bank Accounts</li>
            <li>Credit Card Accounts</li>
          </ul>

          <p>You need at least one account before adding transactions.</p>
        </Section>

        {/* Transactions */}
        <Section title="2. Add Transactions">
          <p>PennyWise supports three types of transactions.</p>

          <SubSection title="2.1. Expense (Debit)">
            <p>Money going out of an account.</p>
            <p class="text-gray-500 text-sm">
              Example: food, shopping, subscriptions.
            </p>
          </SubSection>

          <SubSection title="2.2. Income (Credit)">
            <p>Money coming into an account.</p>
            <p class="text-gray-500 text-sm">
              Example: salary, refund, interest.
            </p>
          </SubSection>

          <SubSection title="2.3. Transfer">
            <p>Move money between two accounts.</p>

            <ul class="list-disc list-inside text-gray-400 text-sm ml-1">
              <li>Debits the from account</li>
              <li>Credits the to account</li>
              <li>Only bank accounts are supported</li>
            </ul>
          </SubSection>
        </Section>

        {/* Edit/Delete */}
        <Section title="2.4. Edit & Delete Transactions">
          <p>You can edit or delete any transaction.</p>

          <ul class="list-disc list-inside text-gray-400 ml-1">
            <li>Transfer accounts cannot be edited after creation</li>
            <li>Editing updates the original record</li>
            <li>Deleting removes the transaction permanently</li>
          </ul>
        </Section>

        {/* Recurring */}
        <Section title="3. Recurring Transactions">
          <p>
            Recurring transactions are generated automatically when the app
            loads.
          </p>

          <SubSection title="3.1. Recurring Expense">
            <p>Fixed monthly expenses like rent or subscriptions.</p>
          </SubSection>

          <SubSection title="3.2. Recurring Income">
            <p>Monthly income like salary or allowances.</p>
          </SubSection>

          <SubSection title="3.3. EMI">
            <ul class="list-disc list-inside text-gray-400 ml-1">
              <li>Tracks total amount</li>
              <li>Tracks monthly EMI</li>
              <li>Tracks remaining installments</li>
              <li>Automatically stops when completed</li>
            </ul>
          </SubSection>

          <ul class="list-disc list-inside text-gray-400 mt-2 ml-1">
            <li>Recurring type cannot be changed after creation</li>
            <li>You can activate or deactivate recurring transactions</li>
            <li>
              Deleting a recurring transaction deletes all generated entries
            </li>
          </ul>
        </Section>

        {/* Settings */}
        <Section title="4. Settings & Data">
          <SubSection title="4.1. Preferences">
            <ul class="list-disc list-inside text-gray-400 ml-1">
              <li>Currency</li>
              <li>Monthly Income (currently informational)</li>
              <li>Monthly Budget (currently informational)</li>
            </ul>
          </SubSection>

          <SubSection title="4.2. Import Database">
            <p>Paste a JSON export to restore data on this device.</p>
          </SubSection>

          <SubSection title="4.3. Export Database">
            <p>Generates a JSON snapshot of your entire database.</p>
          </SubSection>

          <SubSection title="4.4. Clear Database">
            <p class="text-red-400">
              Permanently deletes all data on this device.
            </p>
            <p class="text-gray-500 text-sm">There is no undo.</p>
          </SubSection>
        </Section>

        {/* Import/Export */}
        <Section title="5. Syncing Between Devices">
          <p>PennyWise does not sync automatically.</p>

          <ol class="list-decimal list-inside text-gray-400 ml-1">
            <li>Export database on device A</li>
            <li>Import the JSON on device B</li>
          </ol>
        </Section>

        {/* Stats */}
        <Section title="6. Stats Page">
          <p>The Stats page is currently a placeholder.</p>
          <p>
            It will be expanded with detailed dashboards in future versions.
          </p>
        </Section>

        <Divider />

        {/* Footer */}
        <p class="text-center text-xs text-gray-500 mt-8">
          PennyWise is a personal, offline-first project focused on simplicity
          and privacy.
        </p>
      </div>
    </>
  );
};

export default GuidePage;
