import { Paper, Text } from "@mantine/core";
import React from "react";
import { Avatar } from "@mantine/core";
import Link from "next/link";

export default function MiniProfile({
  username,
  pfpLink,
  topRightComponent,
}: {
  username: string;
  pfpLink?: string;
  topRightComponent?: React.ReactNode;
}) {
  return (
    <Paper radius="sm" shadow="md" component="a" href={"./" + username}>
      <div className="p-4 flex flex-col gap-2 items-center relative">
        <div className="absolute right-0 top-0">{topRightComponent}</div>
        <Link
          href={`/profile/${username}`}
          className="flex flex-col gap-2 items-center"
        >
          <Avatar name={username} size="lg" src={pfpLink} />
          <Text fw={700}>{username}</Text>
        </Link>
      </div>
    </Paper>
  );
}
