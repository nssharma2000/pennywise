import { type Component, type JSXElement } from "solid-js";
import NavBar from "./NavBar";

const Layout: Component<{ children?: JSXElement }> = (props) => {
  return (
    <div class="min-h-screen bg-background pb-20">
      {/* Main Content */}
      <main class="container mx-auto px-4 py-6 w-screen">{props.children}</main>

      {/* Bottom Navigation */}
      <NavBar />
    </div>
  );
};

export default Layout;
