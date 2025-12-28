import { ArrowLeftIcon } from "lucide-solid";
import { cn } from "~/lib/utils";
import UIButton from "../ui/Button";

function BackButton({
  handleClick,
  position,
}: {
  handleClick: () => void;
  position?: { x?: string; y?: string };
}) {
  return (
    <div
      class={cn(
        "fixed",
        "bg-purple-700 shadow-lg flex items-start pr-1",
        "hover:bg-purple-800",
        "mb-0!",
        "bottom-[30px] right-0",
        `${position?.y ? `bottom-[${position.y}]` : ""}`,
        `${position?.x ? `right-[${position.x}]` : ""}`
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
        <ArrowLeftIcon size={36} />
      </UIButton>
    </div>
  );
}

export default BackButton;
