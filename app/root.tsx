import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "~/utils/theme-provider";
import type { Theme } from "~/utils/theme-provider";
import { getThemeSession } from "~/utils/theme.server";
import mainStyles from "./tailwind.css";
import { getUser } from "./utils/session.server";
import { User } from "@fnndsc/chrisapi";

export type LoaderData = {
  theme: Theme | null;
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const user = await getUser(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    user: user ?? null,
  };

  return data;
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: mainStyles,
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

function App() {
  const data = useLoaderData<LoaderData>();

  return (
    <html lang="en" className="h-full bg-gray-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
