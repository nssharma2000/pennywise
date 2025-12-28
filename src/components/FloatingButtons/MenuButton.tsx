import { useNavigate } from "@solidjs/router";
import { BadgeQuestionMarkIcon, SettingsIcon } from "lucide-solid";
import { type Component, createSignal, For, Show } from "solid-js";
import { cn } from "~/lib/utils";

interface HamburgerMenuItem {
  icon: Component<{ size?: number; class?: string }>;
  label: string;
  onClick: () => void;
  color?: string;
}

interface MenuButtonProps {
  items: HamburgerMenuItem[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const MenuButton: Component<MenuButtonProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  const getPositionClasses = () => {
    switch (props.position || "top-right") {
      case "top-right":
        return { container: "top-4 right-4", items: "top-16 right-4" };
      case "top-left":
        return { container: "top-4 left-4", items: "top-16 left-4" };
      case "bottom-right":
        return {
          container: "bottom-[76px] right-0",
        };
      case "bottom-left":
        return { container: "bottom-4 left-4", items: "bottom-16 left-4" };
      default:
        return { container: "top-4 right-4", items: "top-16 right-4" };
    }
  };

  const positions = getPositionClasses();

  const onSettingsClick = () => {
    navigate("/settings");
  };
  const onGuideClick = () => {
    navigate("/guide");
  };

  const allOptions: HamburgerMenuItem[] = [
    { label: "Settings", icon: SettingsIcon, onClick: onSettingsClick },
    {
      label: "Guide",
      icon: BadgeQuestionMarkIcon,
      onClick: onGuideClick,
    },
    ...props.items,
  ];

  return (
    <>
      <div
        class={cn(
          "fixed z-50 flex flex-row-reverse gap-1.5 items-end justify-center mb-0!",
          positions.container
        )}
      >
        {/* Hamburger Button */}
        <div
          class={cn(
            "bg-purple-700 shadow-lg flex items-start pr-1",
            "hover:bg-purple-800"
          )}
          style={{ "border-radius": "40px 0 0 40px" }}
        >
          <button
            onClick={toggleMenu}
            class={cn(
              "w-12 h-12",
              "flex items-center justify-center",
              "transition-all duration-300 ease-out",
              "active:scale-95"
            )}
            style={{
              color: "var(--background-color)",
            }}
          >
            {/* Animated Hamburger to X */}
            <div class="relative w-5 h-5 flex flex-col justify-center items-center">
              {/* Top line */}
              <span
                class={cn(
                  "absolute w-5 h-0.5 transition-all duration-300 ease-out",
                  isOpen()
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-2 rotate-0"
                )}
                style={{
                  "background-color": "var(--background-color)",
                }}
              />
              {/* Middle line */}
              <span
                class={cn(
                  "absolute w-5 h-0.5 transition-all duration-300 ease-out",
                  isOpen() ? "opacity-0 scale-0" : "opacity-100 scale-100"
                )}
                style={{
                  "background-color": "var(--background-color)",
                }}
              />
              {/* Bottom line */}
              <span
                class={cn(
                  "absolute w-5 h-0.5 transition-all duration-300 ease-out",
                  isOpen()
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-2 rotate-0"
                )}
                style={{
                  "background-color": "var(--background-color)",
                }}
              />
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <Show when={isOpen()}>
          <For each={allOptions}>
            {(item, index) => (
              <button
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                class={cn(
                  "flex flex-col items-start justify-end gap-3 group",
                  "transition-all duration-300 ease-out",
                  "animate-in slide-in-from-right-5 fade-in"
                )}
                style={{
                  "animation-delay": `${index() * 50}ms`,
                  "animation-fill-mode": "both",
                }}
              >
                {/* Label */}
                {/* <span class="bg-gray-900 text-white px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg">
                  {item.label}
                </span> */}

                {/* Icon Button */}
                <div
                  class={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                    "group-hover:scale-110 group-active:scale-95",
                    item.color || "bg-purple-700"
                  )}
                  style={{
                    color: "var(--background-color)",
                  }}
                >
                  <item.icon size={18} />
                </div>
              </button>
            )}
          </For>
        </Show>
      </div>
      <Show when={isOpen()}>
        {/* Backdrop */}
        <div
          class="fixed inset-0 bg-black/40 z-30 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      </Show>
    </>
  );
};

export default MenuButton;
