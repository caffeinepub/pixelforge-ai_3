import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Route as RootRoute } from "./routes/__root";
import { Route as GalleryRoute } from "./routes/gallery";
import { Route as GenerateRoute } from "./routes/generate";
import { Route as IndexRoute } from "./routes/index";

const routeTree = RootRoute.addChildren([
  IndexRoute,
  GenerateRoute,
  GalleryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
