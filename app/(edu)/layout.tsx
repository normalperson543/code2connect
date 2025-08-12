import MTWrapper from "@/components/mt-wrapper";
import EduAppShell from "@/components/edu/app-shell";
import { ColorSchemeScript } from "@mantine/core";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      
      <MTWrapper includeHeader={false}>
        <EduAppShell>{children}</EduAppShell>
      </MTWrapper>
    </>
  );
}
