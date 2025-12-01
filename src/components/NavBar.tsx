import { A } from "@solidjs/router";
import { ChartArea, CreditCard, ReceiptIndianRupee } from "lucide-solid";
import type { Component } from "solid-js";

const NavBar: Component = () => {
  return (
    <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border bg-background z-10">
      <div class="container mx-auto">
        <div class="flex justify-around gap-10 py-3 px-8">
          <A
            href="/dashboard"
            class="flex flex-col items-center gap-1 text-xs"
            activeClass="text-foreground font-semibold"
            inactiveClass="text-foreground/60"
          >
            <ChartArea size={24} />
            <span>Stats</span>
          </A>
          <A
            href="/accounts"
            class="flex flex-col items-center gap-1 text-xs"
            activeClass="text-foreground font-semibold"
            inactiveClass="text-foreground/60"
          >
            <CreditCard size={24} />
            <span>Accounts</span>
          </A>
          <A
            href="/transactions"
            class="flex flex-col items-center gap-1 text-xs"
            activeClass="text-foreground font-semibold"
            inactiveClass="text-foreground/60"
          >
            <ReceiptIndianRupee size={24} />
            <span>Transactions</span>
          </A>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
