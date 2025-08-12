import { Card, Title, Text } from "@mantine/core";
import Image from "next/image";

export default function MiniClass({
  imageSrc,
  name,
  teacherName,
}: {
  imageSrc: string;
  name: string;
  teacherName: string;
}) {
  return (
    <Card shadow="sm" padding="sm" radius="sm">
      <Card.Section>
        <Image
          src={imageSrc}
          height={240}
          width={320}
          alt="Class cover"
          className="h-24 object-cover"
        />
      </Card.Section>
      <div className="mt-2">
        <Title order={5}>{name}</Title>
        <Text c="dimmed">{teacherName}</Text>
      </div>
    </Card>
  );
}
