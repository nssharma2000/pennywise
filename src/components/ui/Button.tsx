import type { Component, JSXElement } from "solid-js";

type ButtonProps = {
  onClick?: () => void;
  title?: string;
  class?: string;
  type?: "button" | "submit" | "reset";
  children: JSXElement;
  disabled?: boolean;
};

const UIButton: Component<ButtonProps> = ({
  onClick,
  children,
  title,
  class: className,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const styles =
    "w-max flex items-center justify-center gap-2 px-4 py-2 text-sm bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors cursor-pointer " +
    className;
  return (
    <button
      onClick={onClick}
      title={title}
      class={styles}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default UIButton;
