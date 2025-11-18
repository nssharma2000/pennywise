import { Router, Route } from "@solidjs/router";
import Dashboard from "~/pages/Dashboard";
import Accounts from "~/pages/Accounts";
import Expenses from "~/pages/Expenses";
import Profile from "~/pages/Profile";
import Layout from "~/components/Layout";
import Toast from "~/components/ui/Toast";
import { useRecurringGenerator } from "./hooks/useRecurringGenerator";
import LandingPage from "./pages/LandingPage";

function App() {
  useRecurringGenerator();
  return (
    <>
      <Router root={Layout}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/profile" component={Profile} />
        <Route path="*404" component={LandingPage} />
      </Router>
      <Toast />
    </>
  );
}

export default App;
