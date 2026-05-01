import { TestContextMenu } from "@/components/test/common/test-context-menu";

export default function FullMockTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TestContextMenu module="full-mock-test" />
    </>
  );
}
