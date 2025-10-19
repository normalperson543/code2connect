import FakeLoadingTerminal from "@/components/fake-loading-terminal";
import MTWrapper from "@/components/mt-wrapper";
import { Loader } from "@mantine/core";

export default function Loading() {
  return (
    <MTWrapper>
      <div className="flex w-full h-full items-center justify-center -my-14">
        <FakeLoadingTerminal />
      </div>
    </MTWrapper>
  );
}
