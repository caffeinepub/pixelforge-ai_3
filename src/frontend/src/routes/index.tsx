import { createRoute } from "@tanstack/react-router";
import { Layout } from "../Layout";
import LandingPage from "../pages/LandingPage";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: function Index() {
    return (
      <Layout>
        <LandingPage />
      </Layout>
    );
  },
});
