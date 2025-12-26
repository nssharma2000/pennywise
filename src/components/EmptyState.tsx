import type { Component, JSXElement } from "solid-js";

type EmptyStateProps = {
  text: string;
  action: JSXElement;
  icon: JSXElement;
  title: string;
  small?: boolean;
};

const EmptyState: Component<EmptyStateProps> = ({
  text,
  action,
  icon,
  title,
  small,
}) => {
  return (
    <div
      class={`flex flex-col gap-4 justify-center items-center text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${
        small && "py-2! gap-1! bg-gray-900 border-none"
      }`}
    >
      {icon}
      <h3
        class={`text-lg font-semibold text-gray-700 ${
          small && "text-gray-400!"
        }`}
      >
        {title}
      </h3>
      <p class="text-gray-500">{text}</p>
      {action}
    </div>
  );
};

export default EmptyState;
