import MTWrapper from "@/components/mt-wrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pb-4 w-full h-full">
      <MTWrapper>{children}</MTWrapper>
    </div>
  );
}
