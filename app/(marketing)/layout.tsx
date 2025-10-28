import MTWrapper from "@/components/mt-wrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      <MTWrapper>{children}</MTWrapper>
    </div>
  );
}
