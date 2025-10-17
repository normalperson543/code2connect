import MTWrapper from "@/components/mt-wrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MTWrapper>{children}</MTWrapper>;
}
