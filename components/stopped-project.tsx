import { PauseIcon } from "@heroicons/react/24/outline";
import { Title, Text } from "@mantine/core";

export default function StoppedProject() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full h-full text-center">
      <PauseIcon className="opacity-50" width={64} height={64} />
      <Title order={5}>Project Stopped</Title>
      <Text>Click the Run button to restart the project.</Text>
    </div>
  );
}
