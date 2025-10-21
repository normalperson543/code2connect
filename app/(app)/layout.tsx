import MTWrapper from "@/components/mt-wrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pb-4">
      <MTWrapper>{children}</MTWrapper>
    </div>
  );
}
