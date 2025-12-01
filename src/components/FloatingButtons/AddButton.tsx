import { PlusIcon } from "lucide-solid";
import { cn } from "~/lib/utils";
import UIButton from "../ui/Button";

function AddButton({ handleClick }: { handleClick: () => void }) {
  return (
    <div
      class={cn(
        "fixed",
        "bg-purple-700 shadow-lg flex items-start pr-1",
        "hover:bg-purple-800",
        "bottom-[130px] right-0 mb-0!"
      )}
      style={{ "border-radius": "40px 0 0 40px" }}
    >
      <UIButton
        class="rounded-full! py-1! px-2! mb-0! bg-none!"
        style={{
          "z-index": "15",
        }}
        onClick={handleClick}
      >
        <PlusIcon size={36} />
      </UIButton>
    </div>
  );
}

export default AddButton;
