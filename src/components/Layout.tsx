import { useNavigate } from "@solidjs/router";
import { type Component, type JSXElement } from "solid-js";
import { isPWAInstalled } from "~/lib/pwa";
import NavBar from "./NavBar";

const Layout: Component<{ children?: JSXElement }> = (props) => {
  const navigate = useNavigate();
  const hasSeenGuide = localStorage.getItem("pw_seen_guide");

  if (!hasSeenGuide && isPWAInstalled()) {
    navigate("/guide");
    localStorage.setItem("pw_seen_guide", "1");
  }
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
