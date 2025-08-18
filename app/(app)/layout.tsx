import MTWrapper from "@/components/mt-wrapper";
import { ColorSchemeScript } from "@mantine/core";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MTWrapper>{children}</MTWrapper>;
}
