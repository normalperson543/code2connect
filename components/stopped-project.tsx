import { Title, Text } from "@mantine/core";

export default function StoppedProject() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full h-full text-center">
      <Title order={5}>Project Stopped</Title>
      <Text>Click the Run button to restart the project.</Text>
    </div>
  )
}