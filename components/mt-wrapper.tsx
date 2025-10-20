// We're using a wrapper for Mantine because the createTheme works better in a client
// component.

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import HeaderLoggedIn from "./header-logged-in";
import { ModalsProvider } from "@mantine/modals";
import theme from "@/app/lib/theme";
export default function MTWrapper({
  children,
  includeHeader = true,
}: {
  children: React.ReactNode;
  includeHeader?: boolean;
}) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        {includeHeader && <HeaderLoggedIn />}
        <div className={`${includeHeader && "mt-14"} w-full h-full`}>
          {children}
        </div>
        <NavigationProgress />
        <Notifications />
      </ModalsProvider>
    </MantineProvider>
  );
}
