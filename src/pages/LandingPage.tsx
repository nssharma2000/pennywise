import { Show, type Component } from "solid-js";
import UIButton from "~/components/ui/Button";
import { useInstallPrompt } from "~/hooks/useInstallPrompt";
import { useServiceWorker } from "~/hooks/useServiceWorker";

const LandingPage: Component = () => {
  const { needRefresh, reloadApp, offlineReady } = useServiceWorker();
  const { canInstall, promptInstall } = useInstallPrompt();
  return (
    <div class="flex flex-col gap-6 text-xl">
      {/*PWA*/}
      <Show when={needRefresh()}>
        <div class="fixed bottom-4 inset-x-0 mx-auto w-fit bg-slate-800 text-white px-4 py-2 rounded-lg shadow-md">
          New version available.{" "}
          <UIButton class="underline" onClick={reloadApp}>
            Reload
          </UIButton>
        </div>
      </Show>
      <Show when={offlineReady()}>
        <div class="fixed bottom-18 inset-x-0 mx-auto w-fit bg-green-600 text-white px-2 py-1 rounded-lg shadow-md z-200 text-xs opacity-45">
          App ready to work offline
        </div>
      </Show>

      <Show when={canInstall()}>
        <UIButton onClick={promptInstall} class="w-max">
          Install PennyWise
        </UIButton>
      </Show>
    </div>
  );
};
export default LandingPage;
